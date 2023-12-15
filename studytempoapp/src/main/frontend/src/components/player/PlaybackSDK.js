import {usePlaybackState, usePlayerDevice, useSpotifyPlayer} from "react-spotify-web-playback-sdk";
import React, {useEffect, useState} from "react";
import Visualizer from "./icons/visualizer.gif";
import SkipBackIcon from "./icons/skipbackicon.png";
import SkipNextIcon from "./icons/skipnexticon.png";
import ShuffleToggle from "./icons/shuffleicon.png";
import SpotifyLogo from "../../assets/SpotifyLogo.png";

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
                <h5 className="currentSong">{currentSong}</h5>
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
            <img src={localStorage.getItem("playlistName") === "" ? playbackState.track_window.current_track.album.images[0].url : localStorage.getItem("playlistIMGUrl")} className="playlistCoverMini"/>
            <div className="playlistTitle">
                <h6>Playing from</h6>
                <h5>{localStorage.getItem("playlistName") === "" ?  playbackState.track_window.current_track.album.name : localStorage.getItem("playlistName")}</h5>
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
function UserProfile() {
    const [spotifyUsername, setSpotifyUsername] = useState("");
    function getSpotifyUsername() {
        fetch("http://localhost:8080/player/username")
            .then(response => response.text())
            .then(username => {
                setSpotifyUsername(username)
            })
    }
    setTimeout(getSpotifyUsername, 500)
    return (
        <div className="spotifyLoginTab">
            <div className="playbackCurrent">
                <h5>Logged in as {spotifyUsername}</h5>
            </div>
            <img src={SpotifyLogo} className="icon"/>
        </div>
    )
}

// returns and displays a "pane" containing album cover, current album, current song, current artists
function CurrentlyPlaying({shuffle, setShuffle}) {
    const playbackState = usePlaybackState();
    const player = useSpotifyPlayer();
    const device = usePlayerDevice();
    if (playbackState === null) return null;
    const currentSong = playbackState.track_window.current_track.name
    const currentAlbum = playbackState.track_window.current_track.album.name;
    const currentArtistsArr = playbackState.track_window.current_track.artists;
    const currentArtists = currentArtistsArr.slice(0, -1).map(currentArtist => `${currentArtist.name}, `).join("") + currentArtistsArr[currentArtistsArr.length-1].name;
    return (
        <div className="playbackCurrentPane">
            <div className="poweredBy"><button><img src={SpotifyLogo} className="integratedIcon"/></button></div>
            <div className="playbackCurrent">
                <div className="centeredH">
                    <img src={playbackState.track_window.current_track.album.images[0].url} className="playlistCover"/>
                    <div className="playbackDetails">
                        <h6 onClick={() => window.open(playbackState.track_window.current_track.album.uri)}>{currentAlbum}</h6>
                        <h5 onClick={() => window.open(playbackState.track_window.current_track.album.uri)}>{currentSong}</h5>
                        <div className="centeredH"><h6 onClick={() => window.open(playbackState.track_window.current_track.artists[0].uri)}>{currentArtists}</h6></div>
                    </div>
                </div>
                <div className="shuffleToggle">
                    <button onClick={() => {
                        setShuffle(shuffle === "true" ? "false" : "true");
                        localStorage.setItem("shuffle", shuffle === "true" ? "false" : "true");
                    }
                    }><img src={ShuffleToggle} className={shuffle === "true" ? "shuffleOn" : "shuffleOff"}/></button>
                </div>
            </div>
        </div>
    )
}

function UserPlaylists({shuffle}) {
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
            <div className="fixed">
                <div className="poweredBy"><button><img src={SpotifyLogo} className="integratedIcon"/></button></div>
            </div>
            <h5 className="yourPlaylistLabel">Your Playlists</h5>
            {userPlaylists ? userPlaylists.items.map((playlist) => <button className="playlistSelector" key={playlist.name} onClick={() => {
                fetch(
                    `http://localhost:8080/player/play-playlist`,
                    {
                        method: "PUT",
                        body: JSON.stringify({context_uri: playlist.uri, device_id: device.device_id, shuffle_state: shuffle === "true" ? "true" : "false"}),
                        headers: {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*"
                        },
                    },
                ).then(() => {
                    localStorage.setItem("playlistName", playlist.name);
                    localStorage.setItem("playlistIMGUrl", playlist.images[0].url);
                })
                }
            }
            ><img className="playlistCoverMini" src={playlist.images[0].url}/>{playlist.name}</button>) : null}
        </div>
    )
}

// end & export
export {CurrentSong, CurrentPlaylist, PlaybackControl, UserPlaylists, CurrentlyPlaying, UserProfile};