import React, {useEffect, useState} from "react";
import "./Player.css";
import {GetIsPlayingOnLoad} from "./Player";
import Visualizer from "./visualizer.gif";

function IsLoggedIn() {
    fetch("http://localhost:8080/api/is-token-valid")
        .then(response => response.text())
        .then(response => {
            if (response === "valid") {
                useEffect(() => {
                    setInterval(CurrentPlaylist, 10000);
                    setInterval(CurrentSong, 4000);
                }, [])
            }
        })
}

function CurrentSong() {
    const [currentSong, setCurrentSong] = useState();
    useEffect(() => {
        setInterval(() => {
            fetch("http://localhost:8080/api/user-currently-playing")
                .then(response => response.text())
                .then(data => {
                    if (data) {
                        document.getElementById("SpotifyLoginBtn").className = "hide";
                        document.getElementById("Visualizer").className = "visualizer";
                        document.getElementById("Playlist").className = "playlist";
                        document.getElementById("PlayerControl").className = "player"
                        GetIsPlayingOnLoad();
                    } else {
                        document.getElementById("SpotifyLoginBtn").className = "spotifyLogin"
                        document.getElementById("Visualizer").className = "hide";
                        document.getElementById("Playlist").className = "hide";
                        document.getElementById("PlayerControl").className = "hide";
                    }
                    let trimmedSong = data
                        .replace(/^(.{40}[^\s]*).*/, "$1") // limits char count to 40
                        .split("(From")[0] // removes all including and after "(From
                        .split("(from")[0] // removes all including and after "(from
                        .replace(/,$/, ""); // removes comma at end if needed
                    setCurrentSong(trimmedSong);
                })
        }, 4000);
    })

    return (
        <div className="playing">
            <img src={Visualizer} id="Visualizer" className="visualizer"/>
            <h5>{currentSong}</h5>
        </div>
    );
}

function CurrentPlaylist() {
    const [currentPlaylist, setCurrentPlaylist] = useState();
    useEffect(() => {
        setInterval(() => {
            fetch("http://localhost:8080/api/user-current-playlist")
                .then(response => response.text())
                .then(data => {
                    if (data === "") {
                        setCurrentPlaylist("Single")
                    } else {
                        setCurrentPlaylist(data);
                    }
                })
        }, 10000)
    }, []);

    return(
        <div>
            <h6>Playing from</h6>
            <h5>{currentPlaylist}</h5>
        </div>

    );
}
export {CurrentSong, CurrentPlaylist};