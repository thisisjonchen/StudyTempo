import "./App.css";
import "./components/clock/time.css";
import "./components/player/Player.css"
import "./components/settings/Settings.css";
import "./components/welcome/Welcome.css";
import React, {useCallback, useRef, useState, useEffect} from "react";
import StudyTempoLogo from "./assets/stlogo.png";
import {Clock} from "./components/clock/clock";
import {FullScreen, useFullScreenHandle} from "react-full-screen";
import {CountdownControl, TimerRenderer} from "./components/clock/timer";
import {Bar, CheckIdleTime, Settings} from "./components/settings/Settings";
import Countdown, {calcTimeDelta} from "react-countdown";
import {CurrentPlaylist, CurrentSong, PlaybackControl} from "./components/player/PlaybackSDK";
import {getCookie, RefreshAuthToken} from "./components/player/PlayerAuth";
import {WebPlaybackSDK} from "react-spotify-web-playback-sdk";
import {Welcome} from "./components/welcome/Welcome.js";
import Abyss from "./components/abyss/abyss";
import {YouTube} from "./components/youtube/YouTube";

function StudyTempo() {
    // check if user visited site before
    const API_URL = "http://localhost:8080";

    // spotify auth token flow: start
    const spotifyLoggedIn = getCookie("spotifyLoggedIn");

    useEffect(() => {
        if (spotifyLoggedIn === "true") {
            RefreshAuthToken();
            setInterval(RefreshAuthToken, 3595000); // refreshes in one hour, leading with assumption setInterval won't be throttled (focused).
        }
        setInterval(CheckIdleTime, 1000);
    }, []);
    
    // landscape checks
    let landscape = window.matchMedia("(orientation: landscape)");

    landscape.addEventListener("change", function(e) {
        if (e.matches) document.getElementById("OrientationCheck").className = "hide";
        else document.getElementById("OrientationCheck").className = "orientationAlertContainer";
    })

    // username + check for has visited
    const [username, setUsername] = useState(localStorage.getItem("username"));

    // sets all localStorage to defaults
    function HasVisited() {
        if (!username) {
            localStorage.setItem("showTODO", "false");
            localStorage.setItem("darkPref", "false");
            localStorage.setItem("screenLock", "false");
            localStorage.setItem("screenMode", "spotify");
            localStorage.setItem("autoRestart", "false");
            localStorage.setItem("breakTimePref", "5");
            localStorage.setItem("breakToggle", "true");
            localStorage.setItem("timerPing", "true");
            localStorage.setItem("volume", "0.5");
            localStorage.setItem("shuffle", "true");
            localStorage.setItem("youtubeURL", "_ITiwPMUzho");
            return false;
        }
        else return true;
    }

    // props ->
    // ui
    const handle = useFullScreenHandle();
    const [showTODO, setShowTODO] = useState(localStorage.getItem("showTODO"));
    const [isFullScreen, setFullScreen] = useState(false);
    const [darkPref, setDarkPref] = useState(localStorage.getItem("darkPref"));
    const [screenLockToggle, setScreenLockToggle] = useState(localStorage.getItem("screenLock"));
    const [screenMode, setScreenMode] = useState(localStorage.getItem("screenMode"));

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

    const [youtubeURL, setYoutubeURL] = useState(localStorage.getItem("youtubeURL"));

    return (
        <WebPlaybackSDK
            initialDeviceName="StudyTempo"
            getOAuthToken={useCallback(callback => callback(getCookie("spotifyAccessToken")), [])}
            initialVolume={volume}
            connectOnInitialized={false}>
            <div id="StudyTempo" className={darkPref === "true" ? "dark" : "light"}>
                <div id="OrientationCheck" className={window.innerWidth < window.innerHeight ? "orientationAlertContainer" : "hide"}>
                    <div className="orientationAlert">
                        <div className="stack">
                            <img alt="StudyTempo Logo" src={StudyTempoLogo} className="welcomeIcon"/>
                            <h1>StudyTempo</h1>
                            <h6>Landscape mode please</h6>
                            <h6 className="orientationRecommendation">Phones are not recommended</h6>
                        </div>
                    </div>
                </div>
                {/*Main*/}
                <FullScreen handle={handle}>
                    <div id="Welcome" className={HasVisited() === false ? "welcomeContainer" : "hide"}>
                        <Welcome setUsername={setUsername}/>
                    </div>
                    <div id="Overlay" className="overlay hide"/>
                    {/*Header*/}
                    <div id="Header" className="header">
                        <div id="HeaderContainer" className="headerContainer">
                            <div id="Logo" className="logo"><button><img alt="StudyTempo Logo" src={StudyTempoLogo} className="stIcon"/><span className="studyLogo">Study</span>Tempo</button></div>
                            <div className="timerContainer">
                                <div className="timerContainer">
                                    <Countdown date={timer} autoStart={false} overtime={true} renderer={props => <TimerRenderer minutes={calcTimeDelta(timer).minutes} seconds={calcTimeDelta(timer).seconds} completed={calcTimeDelta(timer).completed} volume={volume} timerPing={timerPing}
                                                                                              countdownApi={countdownApi} setTimer={setTimer} timerMode={timerMode} setTimerMode={setTimerMode} breakToggle={breakToggle} autoRestart={autoRestart} timerValue={timerValue}/>}
                                               ref={setRef} onStop={() => {setTimerMode("alarm"); try {document.getElementById("Overlay").className="overlay hide";document.getElementById("Timer").className="timer";} catch(e){}}}
                                    />
                                </div>
                            </div>
                            <Bar darkPref={darkPref} setDarkPref={setDarkPref} isFullScreen={isFullScreen} setFullScreen={setFullScreen} handle={handle} screenMode={screenMode} setScreenMode={setScreenMode}/>
                        </div>
                    </div>
                    {/*Header*/}
                    {/*Middle*/}
                    <div id="Main" className="middleContainer">
                        <YouTube screenMode={screenMode} youtubeURL={youtubeURL}/>
                        <div className={screenMode === "spotify" ? "stack" : "hide"}>
                            <h6 className={showTODO === "true" ? "todoLabel" : "hide"}>TO-DO: <span contentEditable="true" className="todo" suppressContentEditableWarning={true}></span></h6>
                            <div className="centerClock">
                                <Clock/>
                            </div>
                            <CurrentSong/>
                        </div>
                    </div>
                    {/*Middle*/}
                    {/*Footer*/}
                    <div id="Footer" className="footer">
                        <div id="FooterContainer" className="footerContainer">
                            <div className="content">
                                <div className={screenMode === "youtube" ? "miniClock" : "hide"}>
                                    <Clock/>
                                </div>
                                <div className={screenMode === "spotify" ? "" : "hide"}>
                                    <CurrentPlaylist/>
                                </div>
                            </div>
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
                          screenLockToggle={screenLockToggle} setScreenLockToggle={setScreenLockToggle} username={username} setYoutubeURL={setYoutubeURL}/>
                {/*Settings*/}
                {/*The Pit*/}
                <Abyss/>
                {/*The Pit*/}
            </div>
        </WebPlaybackSDK>
      );
}
export default StudyTempo;

// JC