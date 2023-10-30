import React, {useEffect, useState} from "react";
import "./Player.css";
import {GetIsPlayingOnLoad} from "./Player";
import Visualizer from "./visualizer.gif";
import {RefreshSpotifyToken} from "./SpotifyLogin";

function CurrentSong() {
    const [currentSong, setCurrentSong] = useState("");
    useEffect(() => {
        fetch("http://localhost:8080/api/is-token-valid")
            .then(response => response.text())
            .then(data => {
                if (data === "valid") {
                    document.getElementById("PlayerControl").className = "player";
                    document.getElementById("SpotifyLoginBtn").className = "hide";
                    setInterval(() => {
                        console.log("play")
                        fetch("http://localhost:8080/api/currently-playing")
                            .then(resp => resp.text())
                            .then(song => {
                                if (song) {
                                    document.getElementById("Visualizer").className = "visualizer";
                                    document.getElementById("Playlist").className = "playlist";
                                    GetIsPlayingOnLoad();
                                } else {
                                    document.getElementById("Visualizer").className = "hide";
                                    document.getElementById("Playlist").className = "hide";
                                }
                                let trimmedSong = song
                                    .replace(/^(.{40}[^\s]*).*/, "$1") // limits char count to 40
                                    .split("(From")[0] // removes all including and after "(From
                                    .split("(from")[0] // removes all including and after "(from
                                    .replace(/,$/, ""); // removes comma at end if needed
                                setCurrentSong(trimmedSong);
                            })
                    }, 5000);
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
    const [currentPlaylist, setCurrentPlaylist] = useState();
    useEffect(() => {
        fetch("http://localhost:8080/api/is-token-valid")
            .then(response => response.text())
            .then(data => {
                if (data === "valid") {
                    setInterval(() => {
                        fetch("http://localhost:8080/api/current-playlist")
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
        <div id="Playlist" className="hide">
            <h6>Playing from</h6>
            <h5>{currentPlaylist}</h5>
        </div>
    );
}


export {CurrentSong, CurrentPlaylist};