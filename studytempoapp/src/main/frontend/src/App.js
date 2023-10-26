import "./clock/time.css";
import "./App.css";
import React, {useEffect, useRef} from "react"
import FullscreenIcon from "./assets/fullscreen.png";
import DarkIcon from "./assets/dark.png";
import SpotifyLogo from "./player/icons/SpotifyLogo.png";
import StudyTempoLogo from "./assets/stlogo.png";
import SkipNextIcon from "./player/icons/skipnexticon.png";
import SkipBackIcon from "./player/icons/skipbackicon.png";
import Visualizer from "./player/visualizer.gif";
import {CreateSpotifyToken, RefreshSpotifyToken} from "./player/SpotifyLogin";
import {CurrentSong, CurrentPlaylist} from "./player/CurrentlyPlaying";
import {Clock} from "./clock/clock";
import {FullScreen, useFullScreenHandle} from "react-full-screen";
import {useState} from "react";
import {GetIsPlayingOnLoad, PlayPause, SkipBack, SkipNext} from "./player/Player";
import Countdown, {CountdownApi} from "react-countdown";
import {timerRenderer} from "./clock/timer";

function StudyTempo() {
    // keep screen on
    let screenLock;
    navigator.wakeLock.request('screen')
        .then(lock => {
            screenLock = lock;
        });

    const handle = useFullScreenHandle();
    const [isFullScreen, setFullScreen] = useState(false);
    const [darkPref, setDarkPref] = useState(localStorage.getItem("darkPref"));
    const [timer, setTimer] = useState(Date.now);
    const countdownRef = useRef(null);
    const setRef = (countdown) => {countdownRef.current = countdown;};
    const countdownApi = countdownRef.current?.getApi();

     function FullScreenBtn() {
        if (isFullScreen) {handle.exit();}
        else {handle.enter();}
        setFullScreen(!isFullScreen);
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
          <div className={darkPref === "true" ? "dark" : "light"}>
              <FullScreen handle={handle}>
                  <div className="header">
                      <div className="logo">
                          <button onClick={() => {location.reload()}}><img src={StudyTempoLogo} className="sticon"/><span>Study</span>Tempo</button>
                      </div>
                      <div className="timer">
                          <Countdown date={timer} renderer={timerRenderer} autoStart={true} api={stop} ref={setRef}/>
                      </div>
                      <div className="bar">
                          <button onClick={CreateSpotifyToken} id="SpotifyLoginBtn" className="spotifyLogin"><img src={SpotifyLogo} className="spotifyIcon"/>Login</button>
                          <button onClick={DarkModeSwitch}><img src={DarkIcon} className="icon"/></button>
                          <button onClick={FullScreenBtn} className="fullscreenBtn"><img src={FullscreenIcon} className="icon"/></button>
                      </div>
                  </div>
                  <div className="container">
                      <div className="clock" onLoad={RefreshSpotifyToken}>
                          <Clock/>
                          <CurrentSong/>
                      </div>
                  </div>
                  <div className="footer">
                      <div className="content">
                          <div id="Playlist" className="playlist">
                              <CurrentPlaylist/>
                          </div>
                      </div>
                      <div className="playerContainer">
                          <div id="PlayerControl" className="hide">
                              <button onClick={SkipBack}><img src={SkipBackIcon} className="playerIcons"/></button>
                              <button onClick={PlayPause}><img id="PlayPause" className="play" onLoad={GetIsPlayingOnLoad()}/></button>
                              <button onClick={SkipNext}><img src={SkipNextIcon} className="playerIcons"/></button>
                          </div>
                      </div>
                      <div id="TimerControl" className="timerControl">
                          <button onClick={() => {setTimer(Date.now() + 900000); countdownApi?.stop();}}>15</button>
                          <button onClick={() => {setTimer(Date.now() + 1500000); countdownApi?.stop();}}>25</button>
                          <button onClick={() => {setTimer(Date.now() + 1800000); countdownApi?.stop();}}>30</button>
                          <button onClick={() => {setTimer(Date.now() + 2700000); countdownApi?.stop();}}>45</button>
                          <button id="timerStart" className={countdownApi?.isPaused ? "start" : "stop"} onClick={countdownApi?.start}>Start</button>
                      </div>
                  </div>
              </FullScreen>
          </div>
      );
}
export default StudyTempo;
