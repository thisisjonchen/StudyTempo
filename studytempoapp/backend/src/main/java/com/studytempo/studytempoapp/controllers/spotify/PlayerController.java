package com.studytempo.studytempoapp.controllers.spotify;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.model_objects.miscellaneous.CurrentlyPlayingContext;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.PlaylistSimplified;
import se.michaelthelin.spotify.model_objects.specification.User;
import se.michaelthelin.spotify.requests.data.player.StartResumeUsersPlaybackRequest;
import se.michaelthelin.spotify.requests.data.player.ToggleShuffleForUsersPlaybackRequest;
import se.michaelthelin.spotify.requests.data.playlists.GetListOfCurrentUsersPlaylistsRequest;
import se.michaelthelin.spotify.requests.data.users_profile.GetCurrentUsersProfileRequest;

@RestController
@RequestMapping("/player")
public class PlayerController {

    private SpotifyApi spotifyApi;

    @Autowired
    public PlayerController(SpotifyApi spotifyApi) {
        this.spotifyApi = spotifyApi;
    }

    CurrentlyPlayingContext currentlyPlayingContext = null;

    // get user currently playing track id for use in getPlaylist
    @GetMapping("/current-playlist-id")
    public String getUserCurrentPlaylistID() {
        try {
            String input = currentlyPlayingContext.getContext().getUri();
            String[] id = input.split("playlist:");
            String playlist = id[id.length-1];
            return playlist;
        }
        catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
        return "";
    }

    @GetMapping("/get-user-playlists")
    public Paging<PlaylistSimplified> getUserPlaylists(@CookieValue("spotifyAccessToken") String spotifyAccessToken) {
        spotifyApi.setAccessToken(spotifyAccessToken);
        final GetListOfCurrentUsersPlaylistsRequest getListOfCurrentUsersPlaylistsRequest = spotifyApi
                .getListOfCurrentUsersPlaylists()
                .limit(30)
                .build();
        try {
            Paging<PlaylistSimplified> playlists = getListOfCurrentUsersPlaylistsRequest.execute();
            spotifyApi.setAccessToken("");
            return playlists;
        }
        catch (Exception e) {
            System.out.println("Error: " + e.getMessage() + " (GET USER PLAYLISTS)");
        }
        return null;
    }

    public static class PlaylistRequest {
        private String context_uri;
        private String device_id;
        private String shuffle_state;

        public PlaylistRequest(String context_uri, String device_id, String shuffle_state) {
            this.context_uri = context_uri;
            this.device_id = device_id;
            this.shuffle_state = shuffle_state;
        }

        public boolean isShuffled() {
            if (shuffle_state == null || shuffle_state.equals("true")) return true;
            return false;
        }
    }

    @PutMapping("/play-playlist")
    @ResponseBody
    public void playPlaylist(@RequestBody PlaylistRequest playlist, @CookieValue("spotifyAccessToken") String spotifyAccessToken) {
        spotifyApi.setAccessToken(spotifyAccessToken);
        System.out.println(playlist.device_id);
        final StartResumeUsersPlaybackRequest startResumeUsersPlaybackRequest = spotifyApi.startResumeUsersPlayback()
                .context_uri(playlist.context_uri)
                .device_id(playlist.device_id)
                .build();
        final ToggleShuffleForUsersPlaybackRequest toggleShuffleForUsersPlaybackRequest = spotifyApi
                .toggleShuffleForUsersPlayback(playlist.isShuffled())
                .device_id(playlist.device_id)
                .build();
        try {
            toggleShuffleForUsersPlaybackRequest.execute();
            Thread.sleep(500);
            startResumeUsersPlaybackRequest.execute();
        }
        catch (Exception e) {
            System.out.println("Error: " + e.getMessage() + " (PLAY PLAYLIST)");
        }
        finally {
            spotifyApi.setAccessToken("");
        }
    }

    @GetMapping("/username")
    public String getUsername(@CookieValue("spotifyAccessToken") String spotifyAccessToken) {
        if (spotifyAccessToken == null) {
            return "";
        }
        spotifyApi.setAccessToken(spotifyAccessToken);
        final GetCurrentUsersProfileRequest getCurrentUsersProfileRequest = spotifyApi.getCurrentUsersProfile()
                .build();
        try {
            final User user = getCurrentUsersProfileRequest.execute();
            String spotifyUsername = user.getDisplayName();
            spotifyApi.setAccessToken("");
            return spotifyUsername;
        }
        catch (Exception e) {
            System.out.println("Error: " + e.getMessage() + " (USERNAME)");
        }
        spotifyApi.setAccessToken("");
        return "";
    }
}
