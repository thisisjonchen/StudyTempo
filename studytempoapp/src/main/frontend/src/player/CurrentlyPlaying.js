import React, {useEffect, useState} from "react";
import "./Player.css";
import Visualizer from "./visualizer.gif";
import {GetIsPlayingOnLoad} from "./Player";
function CurrentlyPlaying() {
    const [currentlyPlaying, setCurrentlyPlaying] = useState();

    useEffect(() => {
        setInterval(() => {
            fetch("http://localhost:8080/api/user-currently-playing")
                .then(response => response.text())
                .then(data => {
                    if(data) {
                        document.getElementById("SpotifyLoginBtn").className = "hide";
                        document.getElementById("Visualizer").className = "visualizer";
                    } else {
                        document.getElementById("SpotifyLoginBtn").className = "spotifyLogin"
                        document.getElementById("Visualizer").className = "hide";
                    }
                    let trimmedSong = data
                        .replace(/^(.{40}[^\s]*).*/, "$1") // limits char count to 40
                        .split("(From")[0] // removes all including and after "(From
                        .split("(from")[0] // removes all including and after "(from
                        .replace(/,$/, ""); // removes comma at end if needed
                    setCurrentlyPlaying(trimmedSong);
                    GetIsPlayingOnLoad();
                })
        }, 2000)

    }, []);

    return(
        <div className="playing">
            <img src={Visualizer} id="Visualizer" className="hide"/>
            <h5>{currentlyPlaying}</h5>
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
                        setCurrentPlaylist("Singles")
                    } else {
                        let trimmedPlaylist = data.replace(/(?![*#0-9]+)[\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Modifier_Base}\p{Emoji_Presentation}]/gu, ""); // removes emojis
                        setCurrentPlaylist(trimmedPlaylist);
                    }
                })
        }, 2000)
    }, []);

    return(
        <div className="playlistContainer">
            <div id="Playlist" className="playlist">
                <h6>Playlist</h6>
                <h5>{currentPlaylist}</h5>
            </div>
        </div>
    );
}
export {CurrentlyPlaying, CurrentPlaylist};