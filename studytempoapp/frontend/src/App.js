import "./App.css";
import "./components/clock/time.css";
import "./components/player/Player.css"
import "./components/settings/Settings.css";
import "./components/welcome/Welcome.css"
import React, {useCallback, useRef, useState} from "react"
import StudyTempoLogo from "./assets/stlogo.png";
import {Clock} from "./components/clock/clock";
import {FullScreen, useFullScreenHandle} from "react-full-screen";
import {CountdownControl, TimerRenderer} from "./components/clock/timer";
import {Bar, Settings} from "./components/settings/Settings";
import Countdown, {calcTimeDelta} from "react-countdown";
import {CurrentPlaylist, CurrentSong, PlaybackControl} from "./components/player/PlaybackSDK";
import {WebPlaybackSDK, usePlaybackState} from "react-spotify-web-playback-sdk";
import {RefreshSpotifyToken} from "./components/player/PlayerAuth";
import {Welcome} from "./components/welcome/Welcome.js";
import Abyss from "./components/abyss/abyss";

function StudyTempo() {
    // check if user visited site before
    const API_URL = "http://localhost";
    const [username, setUsername] = useState(localStorage.getItem("username"));
    function HasVisited() {
        if (!username) return false;
        else return true;
    }

    // get auth token for usage in playback
    const getAuthToken =
        fetch(`${API_URL}:8080/auth/get-token`)
            .then((response) => response.text())
            .then(token => {
                if (token) {
                    setInterval(RefreshSpotifyToken, 3500000) // then setInterval to refresh token
                    return token;
                }
            })

    // ui
    const handle = useFullScreenHandle();
    const [showTODO, setShowTODO] = useState(localStorage.getItem("showTODO"));
    const [isFullScreen, setFullScreen] = useState(false);
    const [darkPref, setDarkPref] = useState(localStorage.getItem("darkPref"));
    const [screenLockToggle, setScreenLockToggle] = useState(localStorage.getItem("screenLock"));

    let screenIdleTime = 0
    const screenIdleMax = 5 // timeout after 5 secs

    function HideControls() {
        document.getElementById("Bar").classList.add("hideOpacity");
        document.getElementById("TimerControl").classList.add("hideOpacity");
        document.getElementById("Logo").classList.add("hideOpacity");
        document.getElementById("Player").classList.add("hideOpacity");
        document.documentElement.style.cursor = "none";
    }

    function ShowControls() {
        screenIdleTime = 0
        document.getElementById("Bar").classList.remove("hideOpacity");
        document.getElementById("TimerControl").classList.remove("hideOpacity");
        document.getElementById("Logo").classList.remove("hideOpacity");
        document.getElementById("Player").classList.remove("hideOpacity");
        document.documentElement.style.cursor = "auto";
    }

    document.addEventListener("mousemove", ShowControls);
    document.addEventListener("touchstart", ShowControls);

    function CheckIdleTime() {
        screenIdleTime++;
        if (screenIdleTime >= screenIdleMax) {
            HideControls();
        }
    }

    setInterval(CheckIdleTime, 1000)

    // timer
    const countdownRef = useRef(null);
    const setRef = (countdown) => {countdownRef.current = countdown;};
    const countdownApi = countdownRef.current?.getApi();
    const [timer, setTimer] = useState(Date.now);
    const [breakTime, setBreakTime] = useState(localStorage.getItem("breakTimePref"));
    const [breakToggle, setBreakToggle] = useState(localStorage.getItem("breakToggle"));
    const [autoRestart, setAutoRestart] = useState(localStorage.getItem("autoRestart"));
    const [timerMode, setTimerMode] = useState("alarm")
    const [timerValue, setTimerValue] = useState(0)

    // sound
    const [timerPing, setTimerPing] = useState(localStorage.getItem("timerPing"));
    const [volume, setVolume] = useState(localStorage.getItem("volume"));
    const [shuffle, setShuffle] = useState(localStorage.getItem("shuffle"));

    //keep screen on
    if (screenLockToggle === "true") {
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
    }

    return (
        <WebPlaybackSDK
            initialDeviceName="StudyTempo"
            getOAuthToken={useCallback(callback => callback(getAuthToken), [])}
            initialVolume={volume}
            connectOnInitialized={false}>
            <div id="StudyTempo" className={darkPref === "true" ? "dark" : "light"}>
                {/*Main*/}
                <FullScreen handle={handle}>
                    <div id="Welcome" className={HasVisited() === false ? "welcomeContainer" : "hide"}>
                        <Welcome setUsername={setUsername}/>
                    </div>
                    <div id="Overlay" className="overlay hide"/>
                    {/*Header*/}
                    <div id="Header" className="header">
                        <div id="HeaderContainer" className="headerContainer">
                            <div id="Logo" className="logo"><button><img src={StudyTempoLogo} className="stIcon"/><span className="studyLogo">Study</span>Tempo</button></div>
                            <div className="timerContainer">
                                <div className="timerContainer">
                                <Countdown date={timer}
                                           autoStart={false}
                                           overtime={true}
                                           renderer={props => <TimerRenderer minutes={calcTimeDelta(timer).minutes} seconds={calcTimeDelta(timer).seconds} completed={calcTimeDelta(timer).completed} volume={volume} timerPing={timerPing}
                                                                                          countdownApi={countdownApi} setTimer={setTimer} timerMode={timerMode} setTimerMode={setTimerMode} breakToggle={breakToggle} autoRestart={autoRestart} timerValue={timerValue}/>}
                                           ref={setRef}
                                           onStop={() => {
                                               setTimerMode("alarm")
                                               try {
                                                   document.getElementById("Overlay").className="overlay hide";
                                                   document.getElementById("Timer").className="timer";
                                                }
                                                catch(e){}}
                                           }
                                />
                                </div>
                            </div>
                            <Bar darkPref={darkPref} setDarkPref={setDarkPref} isFullScreen={isFullScreen} setFullScreen={setFullScreen} handle={handle}/>
                        </div>
                    </div>
                    {/*Header*/}
                    {/*Middle*/}
                    <div id="Main" className="middleContainer">
                        <div className="stack">
                            <h6 className={showTODO === "true" ? "todoLabel" : "hide"}>TO-DO: <span contentEditable="true" className="todo" suppressContentEditableWarning={true}></span></h6>
                            <Clock/>
                            <CurrentSong/>
                        </div>
                    </div>
                    {/*Middle*/}
                    {/*Footer*/}
                    <div id="Footer" className="footer">
                        <div id="FooterContainer" className="footerContainer">
                            <div className="content"><CurrentPlaylist/></div>
                            <div id="Player" className="playerContainer"><PlaybackControl/></div>
                            <CountdownControl timer={timer} setTimer={setTimer} countdownApi={countdownApi} timerValue={timerValue} setTimerValue={setTimerValue}/>
                        </div>
                    </div>
                    {/*Footer*/}
                </FullScreen>
                {/*Main*/}
                {/*Settings*/}
                <Settings API_URL={API_URL} breakTime={breakTime} setBreakTime={setBreakTime} darkPref={darkPref} setDarkPref={setDarkPref}
                          showTODO={showTODO} setShowTODO={setShowTODO} breakToggle={breakToggle} setBreakToggle={setBreakToggle} autoRestart={autoRestart} setAutoRestart={setAutoRestart}
                          timerMode={setTimer} setTimerMode={setTimerMode} timerPing={timerPing} setTimerPing={setTimerPing} volume={volume} setVolume={setVolume} shuffle={shuffle} setShuffle={setShuffle}
                          screenLockToggle={screenLockToggle} setScreenLockToggle={setScreenLockToggle} username={username} setUsername={setUsername}/>
                {/*Settings*/}
                {/*The Pit*/}
                <Abyss/>
                {/*The Pit*/}
            </div>
        </WebPlaybackSDK>
      );
}
export default StudyTempo;
