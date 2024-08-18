import "./globals.css";
import React, {useCallback, useRef, useState, useEffect} from "react";
import Clock from "./components/clock/clock";
import {FullScreen, useFullScreenHandle} from "react-full-screen";
import {CountdownControl} from "./components/clock/timer";
import {CheckIdleTime, Settings} from "./components/settings/Settings";
import {CurrentPlaylist, CurrentSong, PlaybackControl} from "./components/player/PlaybackSDK";
import {getCookie, RefreshAuthToken} from "./components/player/PlayerAuth";
import {WebPlaybackSDK} from "react-spotify-web-playback-sdk";
import {Welcome} from "./components/welcome/Welcome.js";
import Abyss from "./components/abyss/abyss";
import {YouTube} from "./components/youtube/YouTube";
import Header from "./components/header/header";
import OrientationCheck from "./components/checks/orientation-check";
import Gemini from "./components/gemini/gemini";

const StudyTempo = () => {
    const API_URL = process.env.REACT_APP_API_URL

    // spotify auth token flow: start
    const spotifyLoggedIn = getCookie("spotifyLoggedIn");

    useEffect(() => {
        if (spotifyLoggedIn === "true") {
            RefreshAuthToken();
            setInterval(RefreshAuthToken, 3595000); // refreshes in one hour, leading with assumption setInterval won't be throttled (focused).
        }
        setInterval(CheckIdleTime, 1000);
    }, []);

    // username + check for has visited
    const [username, setUsername] = useState(localStorage.getItem("username"));

    // sets all localStorage to defaults
    const defaultSettings = {
        showTODO: "true",
        darkPref: "false",
        militaryTime: "false",
        screenLock: "false",
        screenMode: "spotify",
        autoRestart: "false",
        breakTimePref: "5",
        breakToggle: "true",
        timerPing: "true",
        volume: "0.5",
        shuffle: "true",
        youtubeURL: "WuHSBSLK3_A",
    };

    function HasVisited() {
        if (!username) {
            Object.entries(defaultSettings).forEach(([key, value]) => {
                localStorage.setItem(key, value);
            });
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
    const [militaryTime, setMilitaryTime] = useState(localStorage.getItem("militaryTime"));

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

    // misc.
    const [youtubeURL, setYoutubeURL] = useState(localStorage.getItem("youtubeURL"));
    const [gemini, setGemini] = useState(false)


    const handleTimerStop = () => {
        setTimerMode("alarm");
        try {
            document.getElementById("Overlay").className="overlay hideOpacity";document.getElementById("Timer").className="timer";
        } catch (e){}
    }

    return (
        <div className="overflow-x-clip">
            <WebPlaybackSDK
                initialDeviceName="StudyTempo"
                getOAuthToken={useCallback(callback => callback(getCookie("spotifyAccessToken")), [])}
                initialVolume={volume}
                connectOnInitialized={false}>
                <div id="StudyTempo" className={darkPref === "true" ? "dark" : "light"}>
                    <OrientationCheck/>
                    {/*Main*/}
                    <FullScreen handle={handle}>
                        <div id="Overlay" className="overlay hide"/>
                        <Gemini gemini={gemini} setGemini={setGemini} darkPref={darkPref}/>
                        <div className="flex flex-col max-h-screen h-screen overflow-hidden w-full px-5 py-7">
                            <div id="Welcome" className={HasVisited() === false ? "block" : "hide"}>
                                <Welcome setUsername={setUsername}/>
                            </div><div>
                                <Header
                                    volume={volume}
                                    timerPing={timerPing}
                                    countdownApi={countdownApi}
                                    setTimerMode={setTimerMode}
                                    breakToggle={breakToggle}
                                    autoRestart={autoRestart}
                                    timerValue={timerValue}
                                    darkPref={darkPref}
                                    setDarkPref={setDarkPref}
                                    isFullScreen={isFullScreen}
                                    setFullScreen={setFullScreen}
                                    handle={handle}
                                    screenMode={screenMode}
                                    setScreenMode={setScreenMode}
                                    setRef={setRef}
                                    handleTimerStop={handleTimerStop}
                                    timer={timer}
                                    setTimer={setTimer}
                                    timerMode={timerMode}
                                    setGemini={setGemini}
                                    gemini={gemini}
                                />
                            </div>
                            <div id="Main" className="flex h-full items-center justify-center">
                                <div className={screenMode === "youtube" ? "flex flex-shrink py-4 w-full h-full justify-center items-center" : "hide"}>
                                    <YouTube darkPref={darkPref} youtubeURL={youtubeURL}/>
                                </div>
                                {screenMode === "spotify" &&
                                    <div className="flex flex-col items-center">
                                        <div className={showTODO === "true" ? "z-10 gap-2 flex" : "hide"}>
                                            <h6>
                                                TO-DO:
                                            </h6>
                                            <span
                                                contentEditable="true"
                                                className="todo nowrap inline-block font-bold bg-orange-400 min-content px-4 rounded-xl"
                                                placeholder="Edit!"
                                                suppressContentEditableWarning={true}>
                                            </span>
                                        </div>
                                        <Clock militaryTime={militaryTime}/>
                                        <CurrentSong/>
                                    </div>
                                }
                            </div>
                            <div id="Footer" className="flex w-full">
                                <div className="w-1/3">
                                    {screenMode === "youtube" && <Clock militaryTime={militaryTime}/>}
                                    {screenMode === "spotify" && <CurrentPlaylist darkPref={darkPref}/>}
                                </div>
                                <div id="Player" className="flex justify-center ml-auto mt-auto w-1/3">
                                    <PlaybackControl/>
                                </div>
                                <div className="flex justify-end mt-auto w-1/3">
                                    <CountdownControl
                                        timer={timer}
                                        setTimer={setTimer}
                                        countdownApi={countdownApi}
                                        timerValue={timerValue}
                                        setTimerValue={setTimerValue}
                                    />
                                </div>
                            </div>
                        </div>
                    </FullScreen>
                    <Settings API_URL={API_URL}
                              breakTime={breakTime} setBreakTime={setBreakTime}
                              darkPref={darkPref} setDarkPref={setDarkPref}
                              showTODO={showTODO} setShowTODO={setShowTODO}
                              breakToggle={breakToggle} setBreakToggle={setBreakToggle}
                              autoRestart={autoRestart} setAutoRestart={setAutoRestart}
                              timerMode={setTimer} setTimerMode={setTimerMode}
                              timerPing={timerPing} setTimerPing={setTimerPing}
                              volume={volume} setVolume={setVolume}
                              shuffle={shuffle} setShuffle={setShuffle}
                              screenLockToggle={screenLockToggle} setScreenLockToggle={setScreenLockToggle}
                              username={username}
                              setYoutubeURL={setYoutubeURL}
                              militaryTime={militaryTime} setMilitaryTime={setMilitaryTime}
                    />
                    <Abyss darkPref={darkPref}/>
                </div>
            </WebPlaybackSDK>
        </div>
      );
}
export default StudyTempo;

// JC