import React, {useEffect, useState} from "react";
import "./Player.css";
import Visualizer from "./visualizer.gif";
import {RefreshSpotifyToken} from "./SpotifyLogin";

function CurrentSong() {
    const [currentSong, setCurrentSong] = useState("");
    useEffect(() => {
        fetch("http://localhost:8080/auth/is-token-valid")
            .then(response => response.text())
            .then(data => {
                if (data === "valid") {
                    document.getElementById("PlayerControl").className = "player";
                    document.getElementById("SpotifyLoginBtn").className = "hide";
                    setInterval(() => {
                        console.log("play")
                        fetch("http://localhost:8080/player/current-song")
                            .then(resp => resp.text())
                            .then(song => {
                                if (song) {
                                    document.getElementById("Playlist").className = "playlist";
                                    GetIsPlayingOnLoad();
                                } else {
                                    document.getElementById("Playlist").className = "hide";
                                }
                                let trimmedSong = song
                                    .replace(/^(.{40}[^\s]*).*/, "$1") // limits char count to 40
                                    .split("(From")[0] // removes all including and after "(From
                                    .split("(from")[0] // removes all including and after "(from
                                    .replace(/,$/, ""); // removes comma at end if needed
                                setCurrentSong(trimmedSong);
                            })
                    }, 3000);
                }
                else {
                    document.getElementById("SpotifyLoginBtn").className = "spotifyLogin"
                    document.getElementById("PlayerControl").className = "hide";
                }
            })
    }, [])
    return (
        <div className="playing">
            <img src={Visualizer} id="Visualizer" className="hide"/>
            <h5 onLoad={RefreshSpotifyToken}>{currentSong}</h5>
        </div>
    )
}

function CurrentPlaylist() {
    const [currentPlaylist, setCurrentPlaylist] = useState("");
    useEffect(() => {
        fetch("http://localhost:8080/auth/is-token-valid")
            .then(response => response.text())
            .then(data => {
                if (data === "valid") {
                    setInterval(() => {
                        fetch("http://localhost:8080/player/current-playlist")
                            .then(resp => resp.text())
                            .then(playlist => {
                                if (playlist) {
                                    setCurrentPlaylist(playlist);
                                } else {
                                    setCurrentPlaylist("Single");
                                }
                            })
                    }, 10000)
                }
            },)
    }, []);
    return (
        <div className="content">
            <div id="Playlist" className="hide">
                <img className="playlistCover" src={CurrentPlaylistCover()}/>
                <div className="playlistTitle">
                    <h6>Playing from</h6>
                    <h5>{currentPlaylist}</h5>
                </div>
            </div>
        </div>
    );
}

function CurrentPlaylistCover() {
    const [playlistCover, setPlaylistCover] = useState();
    fetch("http://localhost:8080/auth/is-token-valid")
        .then(response => response.text())
        .then(data => {
            if (data === "valid") {
                try {
                    fetch("http://localhost:8080/player/current-playlist-cover")
                        .then(response => response.text())
                        .then(data => {
                            if (data) {
                                setPlaylistCover(data)
                            } else {
                                setPlaylistCover("")
                            }
                        })
                } catch (err) {
                    console.log(err);
                }
            }
        })
    return playlistCover
}

function GetIsPlayingOnLoad() {
    fetch("http://localhost:8080/auth/is-token-valid")
        .then(response => response.text())
        .then(data => {
            if (data === "valid") {
                try {
                    fetch("http://localhost:8080/player/is-playing")
                        .then(response => response.json())
                        .then(isPlaying => {
                            if (isPlaying) {
                                document.getElementById("Visualizer").className = "visualizer";
                                document.getElementById("PlayPause").className = "pause";
                            } else {
                                document.getElementById("PlayPause").className = "play";
                                document.getElementById("Visualizer").className = "hide";
                            }
                        });
                } catch (err) {
                    console.log(err);
                }
            }
        })
}


export {CurrentSong, CurrentPlaylist, GetIsPlayingOnLoad};