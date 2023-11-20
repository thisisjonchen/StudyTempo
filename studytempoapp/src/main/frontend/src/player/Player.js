import SkipBackIcon from "./icons/skipbackicon.png";
import {GetIsPlayingOnLoad} from "./CurrentlyPlaying";
import SkipNextIcon from "./icons/skipnexticon.png";
import React from "react";

const headers = {
    "Content-Type": "application/json",
    "Access-Control-Origin": "*"
}
function SkipNext() {
    try {
        fetch("http://localhost:8080/player/skip", {
            method: "POST",
            headers: headers
        })
    }
    catch (err) {
        console.log(err)
    }
}

function SkipBack() {
    try {
        fetch("http://localhost:8080/player/back", {
            method: "POST",
            headers: headers
        })
    }
    catch (err) {
        console.log(err)
    }
}
function PlayPause() {
    try {
        fetch("http://localhost:8080/player/play-pause", {
            method: "PUT",
            headers: headers
        })
    }
    catch (err) {
        console.log(err)
    }
}

function Pause() {
    try {
        fetch("http://localhost:8080/player/pause", {
            method: "PUT",
            headers: headers
        })
    }
    catch (err) {
        console.log(err)
    }
}

function PlayerControl() {
    return (
        <div className="playerContainer">
            <div id="PlayerControl" className="hide">
                <button onClick={SkipBack}><img src={SkipBackIcon} className="playerIcons"/></button>
                <button onClick={PlayPause}><img id="PlayPause" className="play" onLoad={() => GetIsPlayingOnLoad}/></button>
                <button onClick={SkipNext}><img src={SkipNextIcon} className="playerIcons"/></button>
            </div>
        </div>
    );
}

export {PlayerControl, PlayPause, Pause};