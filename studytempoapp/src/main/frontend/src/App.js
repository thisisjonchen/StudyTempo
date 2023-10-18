import "./clock/clock.css";
import "./App.css";
import React from "react"
import FullscreenIcon from "./assets/fullscreen.png";
import DarkIcon from "./assets/dark.png";
import SpotifyLogo from "./spotify/SpotifyLogo.png";
import StudyTempoLogo from "./assets/stlogo.png";
import {CreateSpotifyToken, RefreshSpotifyToken} from "./spotify/SpotifyLogin";
import {CurrentlyPlaying} from "./spotify/CurrentlyPlaying";
import {Clock} from "./clock/clock";
import {FullScreen, useFullScreenHandle} from "react-full-screen";
import {useEffect, useState} from "react";
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
                          <button onClick={DarkModeSwitch}><img src={DarkIcon} className="icon"/></button>
                          <button onClick={FullScreenBtn} className="fullscreenBtn"><img src={FullscreenIcon} className="icon"/></button>
                      </div>
                  </div>
                  <div className="container">
                      <div className="clock">
                          <Clock />
                          <CurrentlyPlaying />
                      </div>
                  </div>
                  <div onLoad={RefreshSpotifyToken} className="footer">
                      <button onClick={CreateSpotifyToken} className="spotifyLogin"><img src={SpotifyLogo} className="icon"/></button>
                  </div>
              </FullScreen>
          </div>
      );
}
export default StudyTempo;
