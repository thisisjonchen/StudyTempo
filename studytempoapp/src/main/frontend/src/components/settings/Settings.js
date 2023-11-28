import SpotifyLogo from "../../assets/SpotifyLogo.png";
import {CreateSpotifyToken, IsLoggedIn} from "../player/PlayerAuth";
import React from "react";
import DarkIcon from "../../assets/dark.png";
import FullscreenIcon from "../../assets/fullscreen.png";
import {CurrentlyPlaying, GetUsername, UserPlaylists} from "../player/PlaybackSDK";
import {usePlayerDevice} from "react-spotify-web-playback-sdk";
import SpotifyLogoFull from "../../assets/Spotify_Logo_RGB_Black.png";

function FullScreenBtn({isFullScreen, setFullScreen, handle}) {
    if (isFullScreen) {
        handle.exit();
    }
    else {
        handle.enter();
    }
    setFullScreen(!isFullScreen);
}

function DarkModeSwitch({darkPref, setDarkPref}) {
    if(darkPref === "false") {
        setDarkPref("true")
        localStorage.setItem("darkPref", "true");
    } else {
        setDarkPref("false")
        localStorage.setItem("darkPref", "false");
    }
}

function ShowTODOSwitch({showTODO, setShowTODO}) {
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

function Bar({darkPref, setDarkPref, isFullScreen, setFullScreen, handle}) {
    const loggedIn = IsLoggedIn();
    return (
        <div className="bar">
            <button onClick={CreateSpotifyToken} id="SpotifyLoginBtn" className={loggedIn === "invalid" ? "spotifyLogin" : "hide"}><img src={SpotifyLogo} className="spotifyIcon"/>Login</button>
            <button onClick={() => DarkModeSwitch({darkPref, setDarkPref})}><img src={DarkIcon} className="icon"/></button>
            <button onClick={() => FullScreenBtn({isFullScreen, setFullScreen, handle})}><img src={FullscreenIcon} className="icon"/></button>
        </div>
    );
}

function Settings({breakTime, setBreakTime, darkPref, setDarkPref, showTODO, setShowTODO, breakToggle, setBreakToggle}) {
    const device = usePlayerDevice();
    return (
        <div className="settings">
            {/*Left*/}
            <div className="settingsContainer">
                <div className="settingsHeader"><h1>Settings</h1></div>
                <div className="settingsItem">
                    <h5>Dark Mode</h5>
                    <label className="switch">
                        <input type="checkbox" onChange={() => DarkModeSwitch({darkPref, setDarkPref})} checked={darkPref === "true"}/>
                        <span className="slider"></span>
                    </label>
                </div>
                <div className="settingsItem">
                    <h5>Show TODO ✏️</h5>
                    <label className="switch">
                        <input type="checkbox" onChange={() => ShowTODOSwitch({showTODO, setShowTODO})} checked={showTODO === "true"}/>
                        <span className="slider"></span>
                    </label>
                </div>
                <div id="TimerSettings">
                    <h5 className="settingsItem">Timer</h5>
                    <div className="settingsSubItem">
                        <h5>Break ☕️</h5>
                        <label className="switch">
                            <input type="checkbox" onChange={() => BreakToggle({breakToggle, setBreakToggle})} checked={breakToggle === "true"}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className={breakToggle === "true" ? "settingsSubItem" : "hide"}>
                        <h5>Break-Time</h5>
                        <input id="breakSlider" type="range" min="0" max="30" defaultValue={breakTime} step="0.5" className="sliderRange"
                               onChange={breakTimeSlider => {setBreakTime(breakTimeSlider.target.value); localStorage.setItem("breakTimePref", breakTimeSlider.target.value);}}/>
                        <h5 id="BreakTime">{breakTime} Minutes</h5>
                    </div>
                </div>
            </div>
            {/*Left*/}
            {/*Right*/}
            <div className="settingsContainer">
                <div className={device === null ? "hide" :  "spotifyDetailedPane"}>
                    <h1 className="username">Hello, {GetUsername()} <span>:)</span></h1>
                    <h6 className="spotifyGreeting">Ready to Grind? <span>Select a Playlist</span> | Powered by<img src={SpotifyLogoFull} className="spotifyIconFull"/></h6>
                    <CurrentlyPlaying/>
                    <UserPlaylists/>
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