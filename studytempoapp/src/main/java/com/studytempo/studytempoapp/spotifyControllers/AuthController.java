package com.studytempo.studytempoapp.spotifyControllers;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRefreshRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;

import java.io.IOException;
import java.net.URI;

@RestController
@CrossOrigin(origins ="http://localhost:3000") // CORS allow React to fetch Endpoint
@RequestMapping("/auth")
public class AuthController {

    //  specify clientID & clientSecret from Spotify Dev
    private static final String clientID = "ea74b10d170848169662fc6fc322359d";
    private static final String clientSecret = "e5f18fd7b1e64e10a83956a03c50ea49";

    //  specify URI matching Spotify Dev URI
    //  BRUH: was missing trailing slash in redirectUri on Spotify Dev Portal
    private static final URI redirectUri = SpotifyHttpManager.makeUri("http://localhost:8080/auth/get-user-code/");


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
                .scope("user-read-private, user-read-email, user-read-currently-playing, user-read-playback-state, streaming")
                .show_dialog(true)
                .build();
        final URI uri = authorizationCodeUriRequest.execute();
        return uri.toString();
    }

    //  retrieve User Tokens to request User-specific data
    @RequestMapping( value = "get-user-code/", params = "code")
    public String getSpotifyUserCode(@RequestParam String code, HttpServletResponse response) throws IOException {
        AuthorizationCodeRequest authorizationCodeRequest = spotifyApi.authorizationCode(code)
                .build();

        //  check to see if Tokens are available
        try {
            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRequest.execute();

            //  sets access and refresh tokens for Spotify API usage
            spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());
            spotifyApi.setRefreshToken(authorizationCodeCredentials.getRefreshToken());

            System.out.println("(A) Expires in: " + authorizationCodeCredentials.getExpiresIn());
        } catch (IOException | SpotifyWebApiException | org.apache.hc.core5.http.ParseException e) {
            System.out.println("Error " + e.getMessage());
            return e.getMessage();
        }

        response.sendRedirect("http://localhost:3000/");
        return spotifyApi.getAccessToken();
    }
    // if denied
    @RequestMapping(value = "get-user-code/", params = "error")
    public void error(@RequestParam String error, HttpServletResponse response) throws IOException {
        response.sendRedirect("http://localhost:3000/");
    }

    // get token
    @GetMapping("get-token")
    public String getSpotifyUserToken() {
        return spotifyApi.getAccessToken();
    }

    //  refresh tokens
    @PostMapping("refresh-token")
    public void refreshSpotifyUserToken() {
        AuthorizationCodeRefreshRequest authorizationCodeRefreshRequest = spotifyApi.authorizationCodeRefresh()
                .build();
        //  try token refresh
        try {
            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRefreshRequest.execute();

            // Set access and refresh token for further "spotifyApi" object usage...sets both access and refresh tokens as refresh token can only be used once
            spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());
            System.out.println("(R) Expires in: " + authorizationCodeCredentials.getExpiresIn());
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    @GetMapping("is-token-valid")
    public String getIsTokenValid() {
        if (!(spotifyApi.getAccessToken() == null)) {
            return "valid";
        }
        return "invalid";
    }
}