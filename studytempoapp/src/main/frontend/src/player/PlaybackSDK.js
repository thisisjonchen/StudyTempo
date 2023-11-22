import {usePlaybackState, usePlayerDevice, useSpotifyPlayer} from "react-spotify-web-playback-sdk";
import React, {useEffect, useState} from "react";
import Visualizer from "./icons/visualizer.gif";
import SkipBackIcon from "./icons/skipbackicon.png";
import SkipNextIcon from "./icons/skipnexticon.png";

function CurrentSong() {
    const playbackState = usePlaybackState();

    if (playbackState === null) return null;

    const currentSong = playbackState.track_window.current_track.name
        .replace(/^(.{40}[^\s]*).*/, "$1") // limits char count to 40
        .split("(From")[0] // removes all including and after "(From
        .split("(from")[0] // removes all including and after "(from
        .replace(/,$/, ""); // removes comma at end if needed

    return (
        <div className="playing">
            <img src={Visualizer} id="Visualizer" className={playbackState.paused === true ? "hide" : "visualizer"}/>
            <h5>{currentSong}</h5>
        </div>
    );
}

function CurrentPlaylist() {
    const playbackState = usePlaybackState();

    if (playbackState === null) return null;
    return (
        <div id="Playlist" className="playlist">
            <img id="PlaylistCover" className="hide" src={
                fetch("http://localhost:8080/player/current-playlist-cover")
                    .then(response => response.text())
                    .then(playlistCover => {
                        if (playlistCover) {
                            document.getElementById("PlaylistCover").className = "playlistCover";
                            return playlistCover;
                        } else {
                            document.getElementById("PlaylistCover").className = "hide";
                            return "";
                        }})}/>
            <div className="playlistTitle">
                <h6>Playing from</h6>
                <h5>{playbackState.context.metadata.name ? playbackState.context.metadata.name : "Single"}</h5>
            </div>
        </div>
    );
}

function PlaybackControl() {
    const player = useSpotifyPlayer();
    const playbackState = usePlaybackState();

    if (playbackState === null) return null;

    return (
        <div id="PlayerControl" className="player">
            <button onClick={() => player.previousTrack()}><img src={SkipBackIcon} className="playerIcons"/></button>
            <button onClick={playbackState.paused === true ? () => player.resume() : () => player.pause()}>
                <img id="PlayPause" className={playbackState.paused === true ? "play" : "pause"}/></button>
            <button onClick={() => player.nextTrack()}><img src={SkipNextIcon} className="playerIcons"/></button>
        </div>
    );
}

// user

function UserPlaylists() {
    const device = usePlayerDevice();
    const [userPlaylists, setUserPlaylists] = useState(null);
    useEffect(() => {
        fetch("http://localhost:8080/player/get-user-playlists")
            .then(response => response.json())
            .then(playlists => {
                if (playlists) {
                    setUserPlaylists(playlists);
                }
            })
    }, []);
    const [authToken, setAuthToken] = useState("")
    useEffect(() => {
        fetch("http://localhost:8080/auth/get-token")
            .then((response) => response.text())
            .then(response => {
                setAuthToken(response);
            })
    })
    return (
        <div>
            {userPlaylists ? userPlaylists.items.map((playlist) => <button className="textButton" key={playlist.name} onClick={() =>
                {
                    fetch(
                        `https://api.spotify.com/v1/me/player/play?device_id=${device.device_id}`,
                        {
                            method: "PUT",
                            body: JSON.stringify({context_uri: playlist.uri}),
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${authToken}`,
                            },
                        },
                    );
                }}
            >{playlist.name}</button>) : null}
        </div>
    )
}


export {CurrentSong, CurrentPlaylist, PlaybackControl, UserPlaylists};