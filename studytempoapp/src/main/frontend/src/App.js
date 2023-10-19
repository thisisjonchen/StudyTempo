import "./clock/clock.css";
import "./App.css";
import React from "react"
import FullscreenIcon from "./assets/fullscreen.png";
import DarkIcon from "./assets/dark.png";
import SpotifyLogo from "./player/SpotifyLogo.png";
import StudyTempoLogo from "./assets/stlogo.png";
import PlayIcon from "./player/playicon.png";
import SkipNextIcon from "./player/skipnexticon.png";
import SkipBackIcon from "./player/skipbackicon.png";
import {CreateSpotifyToken, RefreshSpotifyToken} from "./player/SpotifyLogin";
import {CurrentlyPlaying} from "./player/CurrentlyPlaying";
import {Clock} from "./clock/clock";
import {FullScreen, useFullScreenHandle} from "react-full-screen";
import {useEffect, useState} from "react";
import {PlayPause, SkipBack, SkipNext} from "./player/Player";
function StudyTempo() {
    const handle = useFullScreenHandle();
    const [isFullScreen, setFullScreen] = useState(false);
    const [darkPref, setDarkPref] = useState(localStorage.getItem("darkPref"));

     function FullScreenBtn() {
        if (isFullScreen) {handle.exit();}
        else {handle.enter();}
        setFullScreen(!isFullScreen);
    }

    function GetDarkPref() {
        if(darkPref === "true") {
            return "dark";
        }
        return "light"
    }

    function DarkModeSwitch() {
        if(darkPref === "false") {
            setDarkPref("true")
            localStorage.setItem("darkPref", "true");
        } else {
            setDarkPref("false")
            localStorage.setItem("darkPref", "false");
        }
    }

      return (
          <div className={GetDarkPref()}>
              <FullScreen handle={handle}>
                  <div className="header">
                      <button onClick={() => {location.reload()}}><img src={StudyTempoLogo} className="sticon"/>Study<span>Tempo</span></button>
                      <div className="bar">
                          <button onClick={CreateSpotifyToken} className="spotifyLogin"><img src={SpotifyLogo} className="spotifyIcon"/>Login</button>
                          <button onClick={DarkModeSwitch}><img src={DarkIcon} className="icon"/></button>
                          <button onClick={FullScreenBtn} className="fullscreenBtn"><img src={FullscreenIcon} className="icon"/></button>
                      </div>
                  </div>
                  <div className="container">
                      <div className="clock" onLoad={RefreshSpotifyToken}>
                          <Clock />
                          <CurrentlyPlaying/>
                      </div>
                  </div>
                  <div className="footer">
                      <button onClick={SkipBack}><img src={SkipBackIcon} className="playerIcons"/></button>
                      <button onClick={PlayPause}><img src={PlayIcon} className="playerIcons"/></button>
                      <button onClick={SkipNext}><img src={SkipNextIcon} className="playerIcons"/></button>
                  </div>
              </FullScreen>
          </div>
      );
}
export default StudyTempo;
