package com.studytempo.studytempoapp.controllers.spotify;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.model_objects.specification.User;

import java.io.IOException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final SpotifyApi spotifyApi;

    @Value("${cors.origin}")
    private String url;

    @Autowired
    public AuthController(SpotifyApi spotifyApi) {
        this.spotifyApi = spotifyApi;
    }

    // Send HTTP request to Spotify to retrieve User Info using specified client details
    @GetMapping("/login")
    public String spotifyLogin() {
        return spotifyApi.authorizationCodeUri()
                .scope("user-read-private, " +
                        "user-read-currently-playing, " +
                        "user-read-playback-state, " +
                        "streaming, " +
                        "playlist-read-private, " +
                        "playlist-read-collaborative")
                .show_dialog(true)
                .build().execute().toString();
    }

    // Retrieve User Tokens to request User-specific data
    @GetMapping("/get-user-code/")
    public void getSpotifyUserCode(@RequestParam String code, HttpServletResponse response) throws IOException {
        try {
            final AuthorizationCodeCredentials credentials = spotifyApi.authorizationCode(code).build().execute();
            spotifyApi.setAccessToken(credentials.getAccessToken());
            final User user = spotifyApi.getCurrentUsersProfile().build().execute();

            // check if user is premium or not
            boolean isPremium = user.getProduct().toString().equals("PREMIUM");

            setCookies(response, credentials, isPremium);

            response.sendRedirect(url);
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            response.sendRedirect(url);
        } finally {
            spotifyApi.setAccessToken("");
        }
    }

    // if denied
    @PutMapping("/get-user-code")
    public void error(HttpServletResponse response) throws IOException {
        setCookie(response, "spotifyLoggedIn", "false", 31560000);
        response.sendRedirect(url);
    }

    // get token
    @GetMapping("/get-auth-token")
    public void refreshSpotifyUserToken(@CookieValue("spotifyRefreshToken") String refreshToken, HttpServletResponse response) {
        try {
            spotifyApi.setRefreshToken(refreshToken);
            final AuthorizationCodeCredentials credentials = spotifyApi.authorizationCodeRefresh().build().execute();
            setCookie(response, "spotifyAccessToken", credentials.getAccessToken(), credentials.getExpiresIn());
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage() + " (GET AUTH TOKEN)");
        } finally {
            spotifyApi.setRefreshToken("");
        }
    }

    private void setCookies(HttpServletResponse response, AuthorizationCodeCredentials credentials, boolean isPremium) {
        String refreshTokenValue = isPremium ? credentials.getRefreshToken() : "NOTPremium";
        String accessTokenValue = isPremium ? credentials.getAccessToken() : "NOTPremium";

        setCookie(response, "spotifyRefreshToken", refreshTokenValue, 31560000); // refreshToken cookie age of 1 year
        setCookie(response, "spotifyAccessToken", accessTokenValue, credentials.getExpiresIn()); // accessToken cookie age of 1 hour
        setCookie(response, "spotifyLoggedIn", String.valueOf(isPremium), 31560000); // match refreshToken cookie age (assuming user does not swap)

        System.out.println("(A) Expires in: " + credentials.getExpiresIn());
    }

    private void setCookie(HttpServletResponse response, String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setMaxAge(maxAge);
        cookie.setSecure(true);
        cookie.setPath("/");
        if (name.equals("spotifyRefreshToken")) {
            cookie.setHttpOnly(true);
        }
        response.addCookie(cookie);
    }
}