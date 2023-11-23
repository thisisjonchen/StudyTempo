import "./App.css";
import "./components/clock/time.css";
import "./components/player/Player.css"
import "./components/settings/Settings.css"
import React, {useCallback, useEffect, useRef, useState} from "react"
import StudyTempoLogo from "./assets/stlogo.png";
import {Clock} from "./components/clock/clock";
import {FullScreen, useFullScreenHandle} from "react-full-screen";
import {CountdownControl, timerRenderer} from "./components/clock/timer";
import {Bar, Settings} from "./components/settings/Settings";
import Countdown from "react-countdown";
import {CurrentPlaylist, CurrentSong, PlaybackControl} from "./components/player/PlaybackSDK";
import {WebPlaybackSDK} from "react-spotify-web-playback-sdk";
import {RefreshSpotifyToken} from "./components/player/PlayerAuth";

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

    // auth
    try {
        useEffect(() => {
            fetch("http://localhost:8080/auth/get-token")
                .then((response) => response.text())
                .then(response => {
                    localStorage.setItem("authToken", response)
                })
            setInterval(RefreshSpotifyToken, 3500000);
        }, [])
    }
    catch (e) {}

    return (
        <WebPlaybackSDK
            initialDeviceName="StudyTempo"
            getOAuthToken={useCallback(callback => callback(localStorage.getItem("authToken")), [])}
            initialVolume={0.1}
            connectOnInitialized={true}>
            <div id="StudyTempo" className={darkPref === "true" ? "dark" : "light"}>
                {/*Main*/}
                <FullScreen handle={handle}>
                    {/*Header*/}
                    <div id="Header" className="header">
                        <div id="HeaderContainer" className="headerContainer">
                            <div id="Logo" className="logo"><button><img src={StudyTempoLogo} className="stIcon"/><span className="studyLogo">Study</span>Tempo</button></div>
                            <div className="timerContainer">
                                <Countdown date={timer} renderer={timerRenderer} ref={setRef}/>
                            </div>
                            <Bar darkPref={darkPref} setDarkPref={setDarkPref} isFullScreen={isFullScreen} setFullScreen={setFullScreen} handle={handle}/>
                        </div>
                    </div>
                    {/*Header*/}
                    {/*Middle*/}
                    <div id="Middle" className="middleContainer">
                        <div className="centerStack">
                            <h6 className={showTODO === "true" ? "todoLabel" : "hide"}>TO-DO: <span contentEditable="true" className="todo" suppressContentEditableWarning={true}>Enter a Task!</span></h6>
                            <Clock/>
                            <CurrentSong/>
                        </div>
                    </div>
                    {/*Middle*/}
                    {/*Footer*/}
                    <div id="Footer" className="footer">
                        <div id="FooterContainer" className="footerContainer">
                            <div className="content"><CurrentPlaylist/></div>
                            <div className="playerContainer"><PlaybackControl/></div>
                            <CountdownControl timer={timer} setTimer={setTimer} countdownApi={countdownApi}/>
                        </div>
                    </div>
                    {/*Footer*/}
                </FullScreen>
                {/*Main*/}
                {/*Settings*/}
                <Settings breakTime={breakTime} setBreakTime={setBreakTime} darkPref={darkPref} setDarkPref={setDarkPref}
                showTODO={showTODO} setShowTODO={setShowTODO}/>
                {/*Settings*/}
            </div>
        </WebPlaybackSDK>
      );
}
export default StudyTempo;
