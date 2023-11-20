import "./clock/time.css";
import "./App.css";
import React, {useRef, useState} from "react"
import StudyTempoLogo from "./assets/stlogo.png";
import {RefreshSpotifyToken} from "./player/SpotifyLogin";
import {CurrentPlaylist, CurrentSong} from "./player/CurrentlyPlaying";
import {Clock} from "./clock/clock";
import {FullScreen, useFullScreenHandle} from "react-full-screen";
import {PlayerControl} from "./player/Player";
import {CountdownControl, timerRenderer} from "./clock/timer";
import {Bar, Settings} from "./Settings";
import Countdown from "react-countdown";

function StudyTempo() {
    // timer props
    const countdownRef = useRef(null);
    const setRef = (countdown) => {countdownRef.current = countdown;};
    const countdownApi = countdownRef.current?.getApi();
    const [timer, setTimer] = useState(Date.now);
    const [breakTime, setBreakTime] = useState(localStorage.getItem("breakTimePref"));

    // keep screen on
    let screenLock;
    navigator.wakeLock.request('screen')
        .then(lock => {
            screenLock = lock;
        });

    // ui
    const handle = useFullScreenHandle();
    const [isFullScreen, setFullScreen] = useState(false);
    const [darkPref, setDarkPref] = useState(localStorage.getItem("darkPref"));

    return (
          <div id="StudyTempo" className={darkPref === "true" ? "dark" : "light"}>
              <FullScreen handle={handle}>
                  <div className="header">
                      <div className="logo">
                          <button onClick={() => {location.reload()}}><img src={StudyTempoLogo} className="sticon"/><span>Study</span>Tempo</button>
                      </div>
                      <div className="timerContainer">
                          <div id="Timer" className="timer">
                              <Countdown date={timer} renderer={timerRenderer} ref={setRef}/>
                          </div>
                      </div>
                      <Bar darkPref={darkPref} setDarkPref={setDarkPref} isFullScreen={isFullScreen} setFullScreen={setFullScreen} handle={handle}/>
                  </div>
                  <div className="container" onLoad={RefreshSpotifyToken}>
                      <div className="clock">
                          <h6 style={{fontWeight:"bold"}}>TO-DO: <span contentEditable="true" className="todo" suppressContentEditableWarning={true}>Enter a Task!</span></h6>
                          <Clock/>
                          <CurrentSong/>
                      </div>
                  </div>
                  <div className="footer">
                      <CurrentPlaylist/>
                      <PlayerControl/>
                      <CountdownControl timer={timer} setTimer={setTimer} countdownApi={countdownApi}/>
                  </div>
              </FullScreen>
              <Settings breakTime={breakTime} setBreakTime={setBreakTime} darkPref={darkPref} setDarkPref={setDarkPref}/>
          </div>
      );
}
export default StudyTempo;
