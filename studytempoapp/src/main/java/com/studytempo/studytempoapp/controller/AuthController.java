package com.studytempo.studytempoapp.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.model_objects.miscellaneous.CurrentlyPlaying;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRefreshRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;
import se.michaelthelin.spotify.requests.data.player.GetUsersCurrentlyPlayingTrackRequest;
import se.michaelthelin.spotify.requests.data.player.SkipUsersPlaybackToNextTrackRequest;

import java.io.IOException;
import java.net.URI;

@RestController
@CrossOrigin(origins ="http://localhost:3000")
@RequestMapping("/api") //   CORS allow React to fetch Endpoint
public class AuthController {

    //  specify clientID & clientSecret from Spotify Dev
    private static final String clientID = "ea74b10d170848169662fc6fc322359d";
    private static final String clientSecret = "147a578893a2420f9a4f4d862e8d5f76";

    //  specify URI matching Spotify Dev URI
    //  BRUH: was missing trailing slash in redirectUri on Spotify Dev Portal
private static final URI redirectUri = SpotifyHttpManager.makeUri("http://localhost:8080/api/get-user-code/");

    private static final SpotifyApi spotifyApi = new SpotifyApi.Builder()
            .setClientId(clientID)
            .setClientSecret(clientSecret)
            .setRedirectUri(redirectUri)
            .build();

    //  send HTTP request to Spotify to retrieve User Info using specified client details
    @GetMapping("login")
    @ResponseBody
    public String spotifyLogin() {
        AuthorizationCodeUriRequest authorizationCodeUriRequest = spotifyApi.authorizationCodeUri()
                .scope("user-read-private, user-read-email, user-read-currently-playing")
                .show_dialog(true)
                .build();
        final URI uri = authorizationCodeUriRequest.execute();
        return uri.toString();
    }

    //  retrieve User Tokens to request User-specific data
    @GetMapping( value = "get-user-code/")
    public String getSpotifyUserCode(@RequestParam(value = "code") String userCode, HttpServletResponse response) throws IOException {
        AuthorizationCodeRequest authorizationCodeRequest = spotifyApi.authorizationCode(userCode)
                .build();

        //  check to see if Tokens are available
        try {
            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRequest.execute();

            //  sets access and refresh tokens for Spotify API usage
            spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());
            spotifyApi.setRefreshToken(authorizationCodeCredentials.getRefreshToken());

            System.out.println("Expires in: " + authorizationCodeCredentials.getExpiresIn());
        } catch (IOException | SpotifyWebApiException | org.apache.hc.core5.http.ParseException e) {
            System.out.println("Error " + e.getMessage());
        }

        response.sendRedirect("http://localhost:3000/");
        return spotifyApi.getAccessToken();
    }

    //  refresh tokens
    @PostMapping("refresh-token")
    public String refreshSpotifyUserToken() {
        AuthorizationCodeRefreshRequest authorizationCodeRefreshRequest = spotifyApi.authorizationCodeRefresh()
                .build();
        //  try token refresh
        try {
            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRefreshRequest.execute();

            // Set access and refresh token for further "spotifyApi" object usage
            spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());

            System.out.println("Expires in: " + authorizationCodeCredentials.getExpiresIn());
        } catch (IOException | SpotifyWebApiException | org.apache.hc.core5.http.ParseException e) {
            System.out.println("Error: " + e.getMessage());
        }
        return spotifyApi.getAccessToken();
}

    //  get user currently playing track
    @GetMapping("user-currently-playing")
    public String getUserCurrent() {

        final GetUsersCurrentlyPlayingTrackRequest getUsersCurrentlyPlayingTrackRequest = spotifyApi.getUsersCurrentlyPlayingTrack().build();

        try {
            final CurrentlyPlaying currentlyPlaying = getUsersCurrentlyPlayingTrackRequest.execute();
            return currentlyPlaying.getItem().getName();
        } catch (Exception e) {
            System.out.println("Something went wrong: " + e.getMessage());
        }

        return "";
    }


    //  skip track
    @PostMapping
    public String skipCurrentTrack() {
        final SkipUsersPlaybackToNextTrackRequest skipUsersPlaybackToNextTrackRequest = spotifyApi
                .skipUsersPlaybackToNextTrack().build();
        try {
            final String req = skipUsersPlaybackToNextTrackRequest.execute();
            return req;
        }
        catch (Exception e) {
            System.out.println("Something went wrong: " + e.getMessage());
        }
        return "";
    }
}
