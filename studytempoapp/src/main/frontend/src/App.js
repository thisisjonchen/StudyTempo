import "./clock/time.css";
import "./App.css";
import "./player/Player.css"
import React, {useRef, useState} from "react"
import StudyTempoLogo from "./assets/stlogo.png";
import {Clock} from "./clock/clock";
import {FullScreen, useFullScreenHandle} from "react-full-screen";
import {CountdownControl, timerRenderer} from "./clock/timer";
import {Bar, Settings} from "./Settings";
import Countdown from "react-countdown";
import {CurrentPlaylist, CurrentSong, PlaybackControl, UserPlaylists} from "./player/PlaybackSDK";
import {WebPlaybackSDK} from "react-spotify-web-playback-sdk";
import {GetAuthToken} from "./player/PlayerAuth";

function StudyTempo() {

    // timer props
    const countdownRef = useRef(null);
    const setRef = (countdown) => {countdownRef.current = countdown;};
    const countdownApi = countdownRef.current?.getApi();
    const [timer, setTimer] = useState(Date.now);
    const [breakTime, setBreakTime] = useState(localStorage.getItem("breakTimePref"));

    // keep screen on
    let screenLock;
    try {
        navigator.wakeLock.request('screen')
            .then(lock => {
                try {
                    screenLock = lock;
                    document.addEventListener('visibilitychange', async () => {
                        if (screenLock !== null && document.visibilityState === 'visible') {
                            screenLock = await navigator.wakeLock.request('screen');
                        }
                    });
                }
                catch (e) {}
            });
    } catch (e) {}

    // ui
    const handle = useFullScreenHandle();
    const [showTODO, setShowTODO] = useState(localStorage.getItem("showTODO"));
    const [isFullScreen, setFullScreen] = useState(false);
    const [darkPref, setDarkPref] = useState(localStorage.getItem("darkPref"));

    return (
        <WebPlaybackSDK
            deviceName="StudyTempo"
            getOAuthToken={GetAuthToken()}
            volume={0.1}
            initialDeviceName="StudyTempo"
            connectOnInitialized={true}>
          <div id="StudyTempo" className={darkPref === "true" ? "dark" : "light"}>
              <FullScreen handle={handle}>
                  <div className="header">
                      <div className="logo">
                          <button><img src={StudyTempoLogo} className="sticon"/><span>Study</span>Tempo</button>
                      </div>
                      <div className="timerContainer">
                          <div id="Timer" className="timer">
                              <Countdown date={timer} renderer={timerRenderer} ref={setRef}/>
                          </div>
                      </div>
                      <Bar darkPref={darkPref} setDarkPref={setDarkPref} isFullScreen={isFullScreen} setFullScreen={setFullScreen} handle={handle}/>
                  </div>
                  <div className="container">
                      <div className="clock">
                          <h6 style={{fontWeight:"bold"}} className={showTODO === "true" ? "h6" : "hide"}>TO-DO: <span contentEditable="true" className="todo" suppressContentEditableWarning={true}>Enter a Task!</span></h6>
                          <Clock/>
                          <CurrentSong/>
                      </div>
                  </div>
                  <div className="footer">
                      <div className="content">
                          <CurrentPlaylist/>
                      </div>
                      <div className="playerContainer"><PlaybackControl/></div>
                      <CountdownControl timer={timer} setTimer={setTimer} countdownApi={countdownApi}/>
                  </div>
              </FullScreen>
              <Settings breakTime={breakTime} setBreakTime={setBreakTime} darkPref={darkPref} setDarkPref={setDarkPref}
                showTODO={showTODO} setShowTODO={setShowTODO}/>
              <UserPlaylists/>
          </div>
        </WebPlaybackSDK>
      );
}
export default StudyTempo;
