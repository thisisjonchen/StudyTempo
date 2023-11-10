import "./clock/time.css";
import "./App.css";
import React, {useRef, useState} from "react"
import FullscreenIcon from "./assets/fullscreen.png";
import DarkIcon from "./assets/dark.png";
import SpotifyLogo from "./player/icons/SpotifyLogo.png";
import StudyTempoLogo from "./assets/stlogo.png";
import SkipNextIcon from "./player/icons/skipnexticon.png";
import SkipBackIcon from "./player/icons/skipbackicon.png";
import {CreateSpotifyToken, RefreshSpotifyToken} from "./player/SpotifyLogin";
import {CurrentPlaylist, CurrentSong, GetIsPlayingOnLoad} from "./player/CurrentlyPlaying";
import {Clock} from "./clock/clock";
import {FullScreen, useFullScreenHandle} from "react-full-screen";
import {PlayPause, SkipBack, SkipNext} from "./player/Player";
import Countdown from "react-countdown";
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

    // timer
    const [timer, setTimer] = useState(Date.now);
    const countdownRef = useRef(null);
    const setRef = (countdown) => {countdownRef.current = countdown;};
    const countdownApi = countdownRef.current?.getApi();

    // timer break
    const [breakTime, setBreakTime] = useState(localStorage.getItem("breakTimePref"));


    // misc functions
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
                  <div className="container" onLoad={RefreshSpotifyToken}>
                      <div className="clock">
                          <Clock/>
                          <CurrentSong/>
                      </div>
                  </div>
                  <div className="footer">
                      <div className="content">
                          <CurrentPlaylist/>
                      </div>
                      <div className="playerContainer">
                          <div id="PlayerControl" className="hide">
                              <button onClick={SkipBack}><img src={SkipBackIcon} className="playerIcons"/></button>
                              <button onClick={PlayPause}><img id="PlayPause" className="play" onLoad={() => GetIsPlayingOnLoad}/></button>
                              <button onClick={SkipNext}><img src={SkipNextIcon} className="playerIcons"/></button>
                          </div>
                      </div>
                      <div id="TimerControl" className="timerControl">
                          <button onClick={() => {setTimer(Date.now() + 900000); countdownApi?.stop();}}>15</button>
                          <button onClick={() => {setTimer(Date.now() + 1500000); countdownApi?.stop();}}>25</button>
                          <button onClick={() => {setTimer(Date.now() + 1800000); countdownApi?.stop();}}>30</button>
                          <button onClick={() => {setTimer(Date.now() + 2700000); countdownApi?.stop();}}>45</button>
                          <button onClick={() => {setTimer(Date.now() + 3599000); countdownApi?.stop();}}>60</button>
                          <button id="timerStart" className={countdownApi?.isPaused ? "start" : "stop"} onClick={countdownApi?.start}>Start</button>
                      </div>
                  </div>
              </FullScreen>
              <div className="settings">
                  <div className="settingsContainer">
                      <div className="settingsHeader">
                          <div className="settingsHeaderItem"><h1>Settings</h1></div>
                          <div className="settingsHeaderItem" style={{justifyContent: "flex-end"}}>
                              <img src={SpotifyLogo} className="icon"/>
                              <h5>Having Problems with Spotify?</h5>
                              <button className="textButton" onClick={CreateSpotifyToken}>Try Logging in Again</button>
                          </div>
                      </div>
                      <div className="settingsItem">
                          <h5>Dark Mode</h5>
                          <label className="switch">
                              <input type="checkbox" onChange={DarkModeSwitch} checked={darkPref === "true"}/>
                                  <span className="slider"></span>
                          </label>
                      </div>
                      <div id="TimerSettings">
                          <div className="settingsItem">
                              <h5>Timer</h5>
                          </div>
                          <div className="settingsSubItem">
                              <h5>Auto-Restart</h5>
                              <label className="switch">
                                  <input type="checkbox"/>
                                  <span className="slider"></span>
                              </label>
                          </div>
                          <div className="settingsSubItem">
                              <h5>Break-Time</h5>
                              <input id="breakSlider" type="range" min="0" max="30" defaultValue={breakTime} step="0.5" className="sliderRange"
                                     onChange={breakTimeSlider => {setBreakTime(breakTimeSlider.target.value); localStorage.setItem("breakTimePref", breakTimeSlider.target.value);}}/>
                              <h5 id="BreakTime">{breakTime} Minutes</h5>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
}
export default StudyTempo;
