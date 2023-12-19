import {CreateSpotifyToken, IsLoggedIn} from "../player/PlayerAuth";
import React, {useEffect, useState} from "react";
import DarkIcon from "../../assets/darkmode.png";
import LightIcon from "../../assets/lightmode.png";
import FullscreenIcon from "../../assets/fullscreen.png";
import MinimizeIcon from "../../assets/minimize.png";
import {CurrentlyPlaying, UserPlaylists, UserProfile} from "../player/PlaybackSDK";
import {usePlayerDevice, useSpotifyPlayer} from "react-spotify-web-playback-sdk";

function FullScreenToggle({isFullScreen, setFullScreen, handle}) {
    if (isFullScreen) handle.exit();
    else handle.enter();
    setFullScreen(!isFullScreen);
}

function DarkModeToggle({darkPref, setDarkPref}) {
    if(darkPref === "false") {
        setDarkPref("true");
        localStorage.setItem("darkPref", "true");
    } else {
        setDarkPref("false");
        localStorage.setItem("darkPref", "false");
    }
}

function ShowTODOToggle({showTODO, setShowTODO}) {
    if(showTODO === "false") {
        setShowTODO("true");
        localStorage.setItem("showTODO", "true");
    } else {
        setShowTODO("false");
        localStorage.setItem("showTODO", "false");
    }
}

function BreakToggle({breakToggle, setBreakToggle}) {
    if(breakToggle === "false") {
        setBreakToggle("true");
        localStorage.setItem("breakToggle", "true");
    } else {
        setBreakToggle("false");
        localStorage.setItem("breakToggle", "false");
    }
}

function AutoRestartToggle({autoRestart, setAutoRestart}) {
    if(autoRestart === "false") {
        setAutoRestart("true");
        localStorage.setItem("autoRestart", "true");
    } else {
        setAutoRestart("false");
        localStorage.setItem("autoRestart", "false");
    }
}

function TimerPingToggle({timerPing, setTimerPing}) {
    if(timerPing === "false") {
        setTimerPing("true");
        localStorage.setItem("timerPing", "true");
    } else {
        setTimerPing("false");
        localStorage.setItem("timerPing", "false");
    }
}

function ScreenLockToggle({screenLockToggle, setScreenLockToggle}) {
    if(screenLockToggle === "false") {
        setScreenLockToggle("true");
        localStorage.setItem("screenLock", "true");
    } else {
        setScreenLockToggle("false");
        localStorage.setItem("screenLock", "false");
    }
}

const onSubmitUsername = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const username = formData.get("username");

    localStorage.setItem("username", username.toString());
    setUsername(username);
}

function GoodGreeting() {
    const now = new Date();
    const nowHour = now.getHours();
    if (nowHour >= 5 && nowHour < 12) return "Good Morning";
    else if (nowHour >= 12 && nowHour < 18) return "Good Afternoon";
    else return "Good Night";
}

function GreetingQuote() {
    const [quote, setQuote] = useState("");
    const now = GoodGreeting();
    let quotes = [""]
    if (now === "Good Morning") { // Morning
        quotes = ["Let's get sh*t done.", "Who's gonna carry the boats?",
                "Wake up. Make your parents proud.", "Show'em who's boss.", "Wakey Wakey Lil' Princess."]
    }
    else if (now === "Good Afternoon") { // Afternoon
        quotes = ["Remember to drink water!", "A lil' coffee break 💅🏻...then back to work", "They don't know me son.",
                "Maybe try a different approach?", "Take a little time to pat yourself on the back :)"]
    }
    else { // Night
        quotes = ["Who needs sleep anyways?", "On da grind.", "Keep pushing. Your time is now.", "While they're sleepin', you're workin'.",
                "They talk sh*t, but look who's sleeping?"]
    }
    useEffect(() => {
        setQuote(quotes[Math.floor(Math.random()*quotes.length)]);
    }, []);
    return quote;
}

function Bar({darkPref, setDarkPref, isFullScreen, setFullScreen, handle}) {
    return (
        <div id="Bar" className="bar">
            <button onClick={() => DarkModeToggle({darkPref, setDarkPref})}><img src={darkPref === "true" ? LightIcon : DarkIcon} className="icon"/></button>
            <button onClick={() => FullScreenToggle({isFullScreen, setFullScreen, handle})}><img src={isFullScreen === true ? MinimizeIcon : FullscreenIcon} className="icon"/></button>
        </div>
    );
}

function Settings({API_URL, breakTime, setBreakTime, darkPref, setDarkPref, showTODO, setShowTODO, breakToggle, setBreakToggle, autoRestart, setAutoRestart, volume, setVolume, timerPing, setTimerPing, shuffle, setShuffle, screenLockToggle, setScreenLockToggle, username}) {
    const device = usePlayerDevice();
    const player = useSpotifyPlayer();
    return (
        <div className="settings">
            {/*Left*/}
            <div className="settingsContainer">
                <div className="settingsHeader"><h1>Settings</h1></div>
                <div id="UISettings">
                    <h5 className="settingsItem">UI</h5>
                    <div className="settingsSubItem">
                        <h5>Dark Mode</h5>
                        <label className="switch">
                            <input type="checkbox" onChange={() => DarkModeToggle({darkPref, setDarkPref})} checked={darkPref === "true"}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsSubItem">
                        <h5>Show TODO ✏️</h5>
                        <label className="switch">
                            <input type="checkbox" onChange={() => ShowTODOToggle({showTODO, setShowTODO})} checked={showTODO === "true"}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
                <div className="settingsSubItem">
                    <h5>Keep Screen On</h5>
                    <label className="switch">
                        <input type="checkbox" onChange={() => ScreenLockToggle({screenLockToggle, setScreenLockToggle})} checked={screenLockToggle === "true"}/>
                        <span className="slider"></span>
                    </label>
                </div>
                <div id="TimerSettings">
                    <h5 className="settingsItem">Timer</h5>
                    <div className="settingsSubItem">
                        <h5>Auto-Restart</h5>
                        <label className="switch">
                            <input type="checkbox" onChange={() => AutoRestartToggle({autoRestart, setAutoRestart})} checked={autoRestart === "true"}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsSubItem">
                        <h5>Break ☕️</h5>
                        <label className="switch">
                            <input type="checkbox" onChange={() => BreakToggle({breakToggle, setBreakToggle})} checked={breakToggle === "true"}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className={breakToggle === "true" ? "settingsSubItem" : "hide"}>
                        <h5>Break-Time</h5>
                        <input type="range" min="0.5" max="30" defaultValue={breakTime} step="0.5" className="range"
                               onChange={breakTimeSlider => {setBreakTime(breakTimeSlider.target.value); localStorage.setItem("breakTimePref", breakTimeSlider.target.value);}}/>
                        <h5 id="BreakTime">{breakTime} Minutes</h5>
                    </div>
                </div>
                <div id="SoundSettings">
                    <h5 className="settingsItem">Sound</h5>
                    <div className="settingsSubItem">
                        <h5>Volume</h5>
                        <input type="range" min="0" max="1" defaultValue={volume} step="0.01" className="range"
                               onChange={volumeSlider => {setVolume(volumeSlider.target.value); localStorage.setItem("volume", volumeSlider.target.value); player.setVolume(Math.round(volume*100)/100)}}/>
                        <h5>{Math.round(volume * 100)}%</h5>
                    </div>
                    <div className="settingsSubItem">
                        <h5>Timer Ping</h5>
                        <label className="switch">
                            <input type="checkbox" onChange={() => TimerPingToggle({timerPing, setTimerPing})} checked={timerPing === "true"}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
                <div id="Misc Settings">
                    <h5 className="settingsItem">Misc.</h5>
                    <div className="miscChange">
                        <button className="miscChangeBtn" onClick={() => CreateSpotifyToken()}>Re-Login to Spotify</button>
                    </div>
                    <div className="miscChange">
                        <button className="miscChangeBtn" onClick={() => {localStorage.setItem("username", ""); window.location.reload()}}>Change Name</button>
                        <div className="nameChangeDesc">
                            <h6>You f*cked up. Here is another chance at typing out a name you like (or maybe...your name) <br/>You're welcome :></h6>
                        </div>
                    </div>
                </div>
            </div>
            {/*Left*/}
            {/*Right*/}
            <div className="settingsContainer">
                <h1 className="username">{GoodGreeting()}, {username ? username : ":>"}</h1>
                <h6 className="greeting">{GreetingQuote()}</h6>
                <div className={device === null ? "" : "hide"}>
                    <UserProfile API_URL={API_URL}/>
                </div>
                <div className={device === null ? "hide" :  "spotifyDetailedPane"}>
                    <CurrentlyPlaying shuffle={shuffle} setShuffle={setShuffle}/>
                    <UserPlaylists shuffle={shuffle} API_URL={API_URL}/>
                </div>
            </div>
            {/*Right*/}
        </div>
    );
}
export {Bar, Settings}