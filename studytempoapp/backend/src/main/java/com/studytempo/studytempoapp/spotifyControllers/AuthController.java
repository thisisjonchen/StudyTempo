package com.studytempo.studytempoapp.spotifyControllers;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.model_objects.specification.User;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRefreshRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;
import se.michaelthelin.spotify.requests.data.users_profile.GetCurrentUsersProfileRequest;

import java.io.IOException;
import java.net.URI;

@RestController
@CrossOrigin(origins ="https://studytempo.co", allowCredentials = "true") // CORS allow React to fetch Endpoint
@RequestMapping("/auth")
public class AuthController {

    //  specify clientID & clientSecret from Spotify Dev
    private static final String clientID = "ea74b10d170848169662fc6fc322359d";
    private static final String clientSecret = "[]";

    private static Cookie refreshTokenCookie = null;

    private static Cookie accessTokenCookie = null;

    private static Cookie loggedInCookie = null;

    //  specify URI matching Spotify Dev URI
    //  BRUH: was missing trailing slash in redirectUri on Spotify Dev Portal
    private static final URI redirectUri = SpotifyHttpManager.makeUri("https://studytempo.co/auth/get-user-code/");

    public static final SpotifyApi spotifyApi = new SpotifyApi.Builder()
            .setClientId(clientID)
            .setClientSecret(clientSecret)
            .setRedirectUri(redirectUri)
            .build();

    //  send HTTP request to Spotify to retrieve User Info using specified client details
    @GetMapping("login")
    @ResponseBody
    public String spotifyLogin() {
        AuthorizationCodeUriRequest authorizationCodeUriRequest = spotifyApi.authorizationCodeUri()
                .scope("user-read-private, user-read-currently-playing, user-read-playback-state, streaming, playlist-read-private, playlist-read-collaborative")
                .show_dialog(true)
                .build();
        final URI uri = authorizationCodeUriRequest.execute();
        return uri.toString();
    }

    //  retrieve User Tokens to request User-specific data
    @RequestMapping( value = "get-user-code/", params = "code")
    public void getSpotifyUserCode(@RequestParam String code, HttpServletResponse response) throws IOException {
        AuthorizationCodeRequest authorizationCodeRequest = spotifyApi.authorizationCode(code)
                .build();
        // check to see if Tokens are available
        try {
            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRequest.execute();
            spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());
            GetCurrentUsersProfileRequest getCurrentUsersProfileRequest = spotifyApi.getCurrentUsersProfile()
                    .build();
            final User user = getCurrentUsersProfileRequest.execute();

            // check if user is premium or not
            // if so, redirect with loggedIn false
            if (user.getProduct().toString().equals("FREE") || user.getProduct().toString().equals("OPEN")) {
                refreshTokenCookie = new Cookie("spotifyRefreshToken", "NOTPremium");
                refreshTokenCookie.setMaxAge(31560000); // refreshToken cookie age of 1 year
                refreshTokenCookie.setHttpOnly(true);
                refreshTokenCookie.setSecure(true);
                refreshTokenCookie.setPath("/");

                accessTokenCookie = new Cookie("spotifyAccessToken", "NOTPremium");
                accessTokenCookie.setMaxAge(authorizationCodeCredentials.getExpiresIn()); // accessToken cookie age of 1 hour
                accessTokenCookie.setSecure(true);
                accessTokenCookie.setPath("/");

                loggedInCookie = new Cookie("spotifyLoggedIn", "false");
                loggedInCookie.setMaxAge(31560000);
                loggedInCookie.setSecure(true);
                loggedInCookie.setPath("/");
            }
            else { // else, redirect with loggedIn true and tokens
                refreshTokenCookie = new Cookie("spotifyRefreshToken", authorizationCodeCredentials.getRefreshToken());
                refreshTokenCookie.setMaxAge(31560000); // refreshToken cookie age of 1 year
                refreshTokenCookie.setHttpOnly(true);
                refreshTokenCookie.setSecure(true);
                refreshTokenCookie.setPath("/");

                accessTokenCookie = new Cookie("spotifyAccessToken", authorizationCodeCredentials.getAccessToken());
                accessTokenCookie.setMaxAge(authorizationCodeCredentials.getExpiresIn()); // accessToken cookie age of 1 hour
                accessTokenCookie.setSecure(true);
                accessTokenCookie.setPath("/");

                loggedInCookie = new Cookie("spotifyLoggedIn", "true");
                loggedInCookie.setMaxAge(31560000); // match refreshToken cookie age (assuming user does not swap)
                loggedInCookie.setSecure(true);
                loggedInCookie.setPath("/");

                System.out.println("(A) Expires in: " + authorizationCodeCredentials.getExpiresIn());
            }
        } catch (IOException | SpotifyWebApiException | org.apache.hc.core5.http.ParseException e) {
            System.out.println("Error " + e.getMessage());
        }

        response.addCookie(accessTokenCookie);
        response.addCookie(loggedInCookie);
        response.addCookie(refreshTokenCookie);
        response.sendRedirect("https://studytempo.co");

        spotifyApi.setAccessToken("");
        refreshTokenCookie = null;
        accessTokenCookie = null;
        loggedInCookie = null;
    }
    // if denied
    @PutMapping(value = "get-user-code/", params = "error")
    public void error(@RequestParam String error, HttpServletResponse response) throws IOException {
        loggedInCookie = new Cookie("spotifyLoggedIn", "false");
        loggedInCookie.setMaxAge(31560000);
        loggedInCookie.setSecure(true);
        loggedInCookie.setPath("/");
        response.addCookie(loggedInCookie);
        response.sendRedirect("https://studytempo.co");
        loggedInCookie = null;
    }

    // get token
    @GetMapping("get-auth-token")
    public void refreshSpotifyUserToken(@CookieValue("spotifyRefreshToken") String refreshToken, HttpServletResponse response) {
        spotifyApi.setRefreshToken(refreshToken);
        AuthorizationCodeRefreshRequest authorizationCodeRefreshRequest = spotifyApi.authorizationCodeRefresh()
                .build();
        //  try token refresh.........maybe detect if access token is expired first before retrying?
        try {
            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRefreshRequest.execute();
            String accessToken = authorizationCodeCredentials.getAccessToken();
            spotifyApi.setRefreshToken("");
            accessTokenCookie = new Cookie("spotifyAccessToken", accessToken);
            accessTokenCookie.setMaxAge(authorizationCodeCredentials.getExpiresIn()); // accessToken cookie age of 1 hour
            accessTokenCookie.setSecure(true);
            accessTokenCookie.setPath("/");
            response.addCookie(accessTokenCookie);
            response.getWriter().flush();
            response.getWriter().close();
        }
        catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
        accessTokenCookie = null;
    }
}