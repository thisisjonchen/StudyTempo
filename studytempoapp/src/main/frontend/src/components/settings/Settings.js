import SpotifyLogo from "../../assets/SpotifyLogo.png";
import {CreateSpotifyToken, IsLoggedIn} from "../player/PlayerAuth";
import React from "react";
import DarkIcon from "../../assets/darkmode.png";
import LightIcon from "../../assets/lightmode.png";
import FullscreenIcon from "../../assets/fullscreen.png";
import MinimizeIcon from "../../assets/minimize.png";
import {CurrentlyPlaying, GetUsername, UserPlaylists} from "../player/PlaybackSDK";
import {usePlayerDevice, useSpotifyPlayer} from "react-spotify-web-playback-sdk";
import SpotifyLogoFull from "../../assets/Spotify_Logo_RGB_Black.png";

function FullScreenToggle({isFullScreen, setFullScreen, handle}) {
    if (isFullScreen) {
        handle.exit();
    }
    else {
        handle.enter();
    }
    setFullScreen(!isFullScreen);
}

function DarkModeToggle({darkPref, setDarkPref}) {
    if(darkPref === "false") {
        setDarkPref("true")
        localStorage.setItem("darkPref", "true");
    } else {
        setDarkPref("false")
        localStorage.setItem("darkPref", "false");
    }
}

function ShowTODOToggle({showTODO, setShowTODO}) {
    if(showTODO === "false") {
        setShowTODO("true")
        localStorage.setItem("showTODO", "true");
    } else {
        setShowTODO("false")
        localStorage.setItem("showTODO", "false");
    }
}

function BreakToggle({breakToggle, setBreakToggle}) {
    if(breakToggle === "false") {
        setBreakToggle("true")
        localStorage.setItem("breakToggle", "true");
    } else {
        setBreakToggle("false")
        localStorage.setItem("breakToggle", "false");
    }
}

function AutoRestartToggle({autoRestart, setAutoRestart}) {
    if(autoRestart === "false") {
        setAutoRestart("true")
        localStorage.setItem("autoRestart", "true");
    } else {
        setAutoRestart("false")
        localStorage.setItem("autoRestart", "false");
    }
}

function TimerPingToggle({timerPing, setTimerPing}) {
    if(timerPing === "false") {
        setTimerPing("true")
        localStorage.setItem("timerPing", "true");
    } else {
        setTimerPing("false")
        localStorage.setItem("timerPing", "false");
    }
}

function Bar({darkPref, setDarkPref, isFullScreen, setFullScreen, handle}) {
    const loggedIn = IsLoggedIn();
    return (
        <div className="bar">
            <button onClick={CreateSpotifyToken} id="SpotifyLoginBtn" className={loggedIn === "invalid" ? "spotifyLogin" : "hide"}><img src={SpotifyLogo} className="spotifyIcon"/>Login</button>
            <button onClick={() => DarkModeToggle({darkPref, setDarkPref})}><img src={darkPref === "true" ? LightIcon : DarkIcon} className="icon"/></button>
            <button onClick={() => FullScreenToggle({isFullScreen, setFullScreen, handle})}><img src={isFullScreen === true ? MinimizeIcon : FullscreenIcon} className="icon"/></button>
        </div>
    );
}

function Settings({breakTime, setBreakTime, darkPref, setDarkPref, showTODO, setShowTODO, breakToggle, setBreakToggle, autoRestart, setAutoRestart, volume, setVolume, timerPing, setTimerPing, shuffle, setShuffle}) {
    const device = usePlayerDevice();
    const player = useSpotifyPlayer();

    if (localStorage.getItem("username") === "") {
        GetUsername();
    }
    const username = localStorage.getItem("username");
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
                               onChange={volumeSlider => {setVolume(volumeSlider.target.value); localStorage.setItem("volume", volumeSlider.target.value); player.setVolume(volume)}}/>
                        <h5 id="BreakTime">{Math.round(volume * 100)}%</h5>
                    </div>
                    <div className="settingsSubItem">
                        <h5>Timer Ping</h5>
                        <label className="switch">
                            <input type="checkbox" onChange={() => TimerPingToggle({timerPing, setTimerPing})} checked={timerPing === "true"}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            </div>
            {/*Left*/}
            {/*Right*/}
            <div className="settingsContainer">
                <div className={device === null ? "hide" :  "spotifyDetailedPane"}>
                    <h1 className="username">Hello, {username} <span>:)</span></h1>
                    <h6 className="spotifyGreeting">Ready to Grind? <span>Select a Playlist</span> | Powered by<img src={SpotifyLogoFull} className="spotifyIconFull"/></h6>
                    <CurrentlyPlaying shuffle={shuffle} setShuffle={setShuffle}/>
                    <UserPlaylists shuffle={shuffle}/>
                </div>
                <div className="spotifyHelp">
                    <img src={SpotifyLogo} className="spotifyIconHelp"/>
                    <h5>Having Problems with Spotify?</h5>
                    <button className="textButton" onClick={CreateSpotifyToken}>Try Logging in Again</button>
                </div>
            </div>
            {/*Right*/}
        </div>
    );
}

export {Bar, Settings}