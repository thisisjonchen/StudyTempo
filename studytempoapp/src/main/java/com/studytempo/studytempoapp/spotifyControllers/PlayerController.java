package com.studytempo.studytempoapp.spotifyControllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import se.michaelthelin.spotify.model_objects.miscellaneous.CurrentlyPlayingContext;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.Playlist;
import se.michaelthelin.spotify.model_objects.specification.PlaylistSimplified;
import se.michaelthelin.spotify.model_objects.specification.User;
import se.michaelthelin.spotify.requests.data.player.GetInformationAboutUsersCurrentPlaybackRequest;
import se.michaelthelin.spotify.requests.data.playlists.GetListOfCurrentUsersPlaylistsRequest;
import se.michaelthelin.spotify.requests.data.playlists.GetPlaylistRequest;
import se.michaelthelin.spotify.requests.data.users_profile.GetCurrentUsersProfileRequest;

import static com.studytempo.studytempoapp.spotifyControllers.AuthController.spotifyApi;

@RestController
@CrossOrigin(origins ="http://localhost:3000") //  CORS allow React to fetch Endpoint
@RequestMapping("/player")
public class PlayerController {

    CurrentlyPlayingContext currentlyPlayingContext = null;
    Playlist playlist = null;

    @GetMapping("fetch-spotify")
    public void fetchSpotify() {
        try {
            final GetInformationAboutUsersCurrentPlaybackRequest getInformationAboutUsersCurrentPlaybackRequest = spotifyApi.getInformationAboutUsersCurrentPlayback().build();
            final GetPlaylistRequest getPlaylistRequest = spotifyApi.getPlaylist(getUserCurrentPlaylistID()).build();
            Playlist playlist = getPlaylistRequest.execute();
            this.playlist = playlist;
        }
        catch (Exception ignored){}
    }

    // get user currently playing track id for use in getPlaylist
    @GetMapping("current-playlist-id")
    public String getUserCurrentPlaylistID() {
        try {
            String input = currentlyPlayingContext.getContext().getUri();
            String[] id = input.split("playlist:");
            return id[id.length-1];
        }
        catch (Exception ignored){}
        return "";
    }

    @GetMapping("get-user-playlists")
    public Paging<PlaylistSimplified> getUserPlaylists() {
        final GetListOfCurrentUsersPlaylistsRequest getListOfCurrentUsersPlaylistsRequest = spotifyApi
                .getListOfCurrentUsersPlaylists()
                .limit(30)
                .build();
        try {
            return getListOfCurrentUsersPlaylistsRequest.execute();
        } catch (Exception ignored){}
        return null;
    }

    @GetMapping("username")
    public String getUsername() {
        final GetCurrentUsersProfileRequest getCurrentUsersProfileRequest = spotifyApi.getCurrentUsersProfile()
                .build();

        try {
            final User user = getCurrentUsersProfileRequest.execute();
            return user.getDisplayName();
        }
        catch (Exception ignored) {}
        return "";
    }
}
