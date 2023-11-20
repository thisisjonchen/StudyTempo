package com.studytempo.studytempoapp.controller;

import org.apache.hc.core5.http.ParseException;
import org.springframework.web.bind.annotation.*;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.miscellaneous.CurrentlyPlayingContext;
import se.michaelthelin.spotify.model_objects.specification.Image;
import se.michaelthelin.spotify.model_objects.specification.Playlist;
import se.michaelthelin.spotify.requests.data.player.*;
import se.michaelthelin.spotify.requests.data.playlists.GetPlaylistRequest;

import java.io.IOException;

import static com.studytempo.studytempoapp.controller.SpotifyController.spotifyApi;

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
            CurrentlyPlayingContext currentlyPlayingContext = getInformationAboutUsersCurrentPlaybackRequest.execute();
            this.currentlyPlayingContext = currentlyPlayingContext;
            final GetPlaylistRequest getPlaylistRequest = spotifyApi.getPlaylist(getUserCurrentPlaylistID()).build();
            Playlist playlist = getPlaylistRequest.execute();
            this.playlist = playlist;
        }
        catch (Exception ignored){}
    }

    //  get user currently playing track
    @GetMapping("current-song")
    public String getUserCurrent() {
        fetchSpotify();
        try {
            return currentlyPlayingContext.getItem().getName();
        }
        catch (Exception ignored){}
        return "";
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

    // returns playlist name
    @GetMapping("current-playlist")
    public String getPlaylist() {
        try {
            return playlist.getName();
        }
        catch (Exception ignored){}
        return "";
    }

    @GetMapping("current-playlist-cover")
    public String getPlaylistCover() {
        try {
            final Image[] images = playlist.getImages();
            return images[0].getUrl();
        }
        catch (Exception ignored){}
        return "";
    }

    // check if playing
    @GetMapping("is-playing")
    public boolean isPlaying() {
        try {
            return currentlyPlayingContext.getIs_playing();
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

    // explicit pause
    @PutMapping("pause")
    public void pauseTrack() {
        final PauseUsersPlaybackRequest pauseUsersPlaybackRequest = spotifyApi.
                pauseUsersPlayback().build();
        try {
            pauseUsersPlaybackRequest.execute();
        }
        catch (IOException | SpotifyWebApiException | ParseException e) {
            System.out.println("Something went wrong: " + e.getMessage());
        }
    }
}
