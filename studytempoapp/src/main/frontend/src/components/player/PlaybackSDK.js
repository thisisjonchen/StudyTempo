import {usePlaybackState, usePlayerDevice, useSpotifyPlayer} from "react-spotify-web-playback-sdk";
import React, {useEffect, useState} from "react";
import Visualizer from "./icons/visualizer.gif";
import SkipBackIcon from "./icons/skipbackicon.png";
import SkipNextIcon from "./icons/skipnexticon.png";
import ShuffleToggleIcon from "./icons/shuffleicon.png";


// returns and displays current song
function CurrentSong() {
    const playbackState = usePlaybackState();
    if (playbackState === null) return null;
    const currentSong = playbackState.track_window.current_track.name
        .replace(/^(.{40}[^\s]*).*/, "$1") // limits char count to 40
        .split("(From")[0] // removes all including and after "(From
        .split("(from")[0] // removes all including and after "(from
        .split("(feat")[0] // removes all including and after "(feat
        .split("[The")[0] // removes all including and after "(feat
        .replace(/,$/, ""); // removes comma at end if needed
    const currentArtists = playbackState.track_window.current_track.artists;
    return (
        <>
            <div className="centeredH">
                <img src={Visualizer} id="Visualizer" className={playbackState.paused === true ? "hide" : "visualizer"}/>
                <h5>{currentSong}</h5>
            </div>
            <h6 className="currentArtistMain">{currentArtists[0].name}</h6>
        </>
    );
}

// returns and displays current playlist
function CurrentPlaylist() {
    const playbackState = usePlaybackState();
    if (playbackState === null) return null;
    return (
        <div id="Playlist" className="centeredH">
            <img src={playbackState.track_window.current_track.album.images[0].url} className="playlistCoverMini"/>
            <div className="playlistTitle">
                <h6>Playing from</h6>
                <h5>{playbackState.context.metadata.name ? playbackState.context.metadata.name : "Single"}</h5>
            </div>
        </div>
    );
}

// returns and displays playback controls: skip back, pause/resume, skip forward
function PlaybackControl() {
    const player = useSpotifyPlayer();
    const playbackState = usePlaybackState();

    if (playbackState === null) return null;

    return (
        <div id="PlayerControl" className="playerControl">
            <button onClick={() => player.previousTrack()}><img src={SkipBackIcon}/></button>
            <button onClick={playbackState.paused === true ? () => player.resume() : () => player.pause()}>
                <img id="PlayPause" className={playbackState.paused === true ? "play" : "pause"}/></button>
            <button onClick={() => player.nextTrack()}><img src={SkipNextIcon}/></button>
        </div>
    );
}

// ! Spotify Detailed Panel: Username, Currently Playing "Pane", and User Playlist Selector

// returns and displays Spotify Profile Username
function GetUsername() {
    const [username, setUsername] = useState("");
    useEffect(() => {
        fetch("http://localhost:8080/player/username")
            .then(response => response.text())
            .then(username => {
                setUsername(username)
            })
    }, [])
    return username;
}

// returns and displays a "pane" containing album cover, current album, current song, current artists
function CurrentlyPlaying() {
    const playbackState = usePlaybackState();
    const player = useSpotifyPlayer();
    if (playbackState === null) return null;
    const currentSong = playbackState.track_window.current_track.name
    const currentAlbum = playbackState.track_window.current_track.album.name;
    const currentArtistsArr = playbackState.track_window.current_track.artists;
    const currentArtists = playbackState.track_window.current_track.artists.slice(0, -1).map(currentArtist => `${currentArtist.name}, `).join("") + currentArtistsArr[currentArtistsArr.length-1].name;
    return (
        <div className="playbackCurrentPane">
            <div className="playbackCurrent">
                <img src={playbackState.track_window.current_track.album.images[0].url} className="playlistCover"/>
                <div className="playbackDetails">
                    <h6>{currentAlbum}</h6>
                    <h5>{currentSong}</h5>
                    <div className="centeredH"><h6>{currentArtists}</h6></div>
                </div>
                <div className="shuffleToggle">
                    <button onClick={() => {
                        fetch("http://localhost:8080/player/shuffle-toggle", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Origin": "*"
                            }
                        })
                    }
                    }><img src={ShuffleToggleIcon}/></button>
                </div>
            </div>
        </div>
    )
}

function UserPlaylists() {
    const device = usePlayerDevice();
    if (device === null) return null;
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
    return (
        <div className="playbackPlaylists">
            {userPlaylists ? userPlaylists.items.map((playlist) => <button className="playlistSelector" key={playlist.name} onClick={() =>
                {
                    fetch(
                        `http://localhost:8080/player/play-playlist`,
                        {
                            method: "PUT",
                            body: JSON.stringify({context_uri: playlist.uri, device_id: device.device_id}),
                            headers: {
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Origin": "*"
                            },
                        },
                    )
                }
            }
            >{playlist.name}</button>) : null}
        </div>
    )
}

// end & export
export {CurrentSong, CurrentPlaylist, PlaybackControl, UserPlaylists, GetUsername, CurrentlyPlaying};