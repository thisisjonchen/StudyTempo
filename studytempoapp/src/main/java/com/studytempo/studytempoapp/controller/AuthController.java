package com.studytempo.studytempoapp.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.apache.hc.core5.http.ParseException;
import org.springframework.web.bind.annotation.*;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.model_objects.miscellaneous.CurrentlyPlaying;
import se.michaelthelin.spotify.model_objects.miscellaneous.CurrentlyPlayingContext;
import se.michaelthelin.spotify.model_objects.specification.Playlist;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRefreshRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;
import se.michaelthelin.spotify.requests.data.player.*;
import se.michaelthelin.spotify.requests.data.playlists.GetPlaylistRequest;

import java.io.IOException;
import java.net.URI;

@RestController
@CrossOrigin(origins ="http://localhost:3000") //  CORS allow React to fetch Endpoint
@RequestMapping("/api")
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
                .scope("user-read-private, user-read-email, user-read-currently-playing, user-read-playback-state, streaming")
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
    // if denied
    public void error(@RequestParam(value = "error") String error, HttpServletResponse response) throws IOException {
        response.sendRedirect("http://localhost:3000/");
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
        } catch (IOException | SpotifyWebApiException | ParseException e) {
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

    // get user currently playing track id for use in getPlaylist
    @GetMapping("user-current-playlist-id")
    public String getUserCurrentPlaylistID() {
        final GetInformationAboutUsersCurrentPlaybackRequest getInformationAboutUsersCurrentPlaybackRequest = spotifyApi.getInformationAboutUsersCurrentPlayback().build();

        try {
            final CurrentlyPlayingContext currentlyPlayingContext = getInformationAboutUsersCurrentPlaybackRequest.execute();
            String input = currentlyPlayingContext.getContext().getUri();
            String[] id = input.split("playlist:");
            return id[id.length - 1];
        } catch (Exception ignored) {
        }
        return "";
    }

    // returns playlist name
    @GetMapping("user-current-playlist")
    public String getPlaylist() {
        final GetPlaylistRequest getPlaylistRequest = spotifyApi.getPlaylist(getUserCurrentPlaylistID())
                .fields("name")
                .build();
        try {
            final Playlist playlist = getPlaylistRequest.execute(); // hung up here
            return playlist.getName();
        }
        catch (IOException | SpotifyWebApiException | ParseException e) {
            System.out.println(e.getMessage());
        }
        return "";
    }

    // check if playing
    @GetMapping("is-playing")
    public boolean isPlaying() {
        final GetUsersCurrentlyPlayingTrackRequest getUsersCurrentlyPlayingTrackRequest = spotifyApi.getUsersCurrentlyPlayingTrack().build();

        try {
            final CurrentlyPlaying currentlyPlaying = getUsersCurrentlyPlayingTrackRequest.execute();
            return currentlyPlaying.getIs_playing();
        } catch (Exception e) {
            System.out.println("Something went wrong: " + e.getMessage());
        }

        return false;
    }

    //  skip track
    @PostMapping("skip")
    public void skipTrack() {
        final SkipUsersPlaybackToNextTrackRequest skipUsersPlaybackToNextTrackRequest = spotifyApi
                .skipUsersPlaybackToNextTrack().build();
        try {
            skipUsersPlaybackToNextTrackRequest.execute();
        }
        catch (Exception e) {
            System.out.println("Something went wrong: " + e.getMessage());
        }
    }

    //  previous track
    @PostMapping("back")
    public void previousTrack() {
        final SkipUsersPlaybackToPreviousTrackRequest skipUsersPlaybackToPreviousTrackRequest = spotifyApi
                .skipUsersPlaybackToPreviousTrack().build();
        try {
            skipUsersPlaybackToPreviousTrackRequest.execute();
        }
        catch (IOException | SpotifyWebApiException | ParseException e) {
            System.out.println("Something went wrong: " + e.getMessage());
        }
    }

    // play/pause track
    @PutMapping("play-pause")
    public void playPauseTrack() {
        final StartResumeUsersPlaybackRequest startResumeUsersPlaybackRequest = spotifyApi.
                startResumeUsersPlayback().build();
        final PauseUsersPlaybackRequest pauseUsersPlaybackRequest = spotifyApi.
                pauseUsersPlayback().build();
        try {
            if (isPlaying()) {
                pauseUsersPlaybackRequest.execute();
            }
            else {
                startResumeUsersPlaybackRequest.execute();
            }
        }
        catch (IOException | SpotifyWebApiException | ParseException e) {
            System.out.println("Something went wrong: " + e.getMessage());
        }
    }
}
