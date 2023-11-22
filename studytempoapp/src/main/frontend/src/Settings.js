import SpotifyLogo from "./player/icons/SpotifyLogo.png";
import {CreateSpotifyToken, IsLoggedIn} from "./player/PlayerAuth";
import React from "react";
import DarkIcon from "./assets/dark.png";
import FullscreenIcon from "./assets/fullscreen.png";

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

function Bar({darkPref, setDarkPref, isFullScreen, setFullScreen, handle}) {
    const loggedIn = IsLoggedIn();
    return (
        <div className="bar">
            <button onClick={CreateSpotifyToken} id="SpotifyLoginBtn" className={loggedIn === "invalid" ? "spotifyLogin" : "hide"}><img src={SpotifyLogo} className="spotifyIcon"/>Login</button>
            <button onClick={() => DarkModeSwitch({darkPref, setDarkPref})}><img src={DarkIcon} className="icon"/></button>
            <button onClick={() => FullScreenBtn({isFullScreen, setFullScreen, handle})} className="fullscreenBtn"><img src={FullscreenIcon} className="icon"/></button>
        </div>
    );
}

function Settings({breakTime, setBreakTime, darkPref, setDarkPref, showTODO, setShowTODO}) {
    return (
        <div className="settings">
            <div className="settingsContainer">
                <div className="settingsHeader">
                    <div className="settingsHeaderItem"><h1 style={{margin:"0 0 20px 0"}}>Settings</h1></div>
                </div>
                <div className="settingsItem">
                    <h5>Dark Mode</h5>
                    <label className="switch">
                        <input type="checkbox" onChange={() => DarkModeSwitch({darkPref, setDarkPref})} checked={darkPref === "true"}/>
                        <span className="slider"></span>
                    </label>
                </div>
                <div className="settingsItem">
                    <h5>Show TODO</h5>
                    <label className="switch">
                        <input type="checkbox" onChange={() => ShowTODOSwitch({showTODO, setShowTODO})} checked={showTODO === "true"}/>
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
            {/*Right*/}
            <div className="settingsContainer">
                <div className="settingsHeader" style={{justifyContent:"flex-end"}}>
                    <div className="settingsHeaderItem" style={{alignItems: "flex-end"}}>
                        <div><h5 style={{fontWeight:"bold", textAlign:"right"}}><img src={SpotifyLogo} style={{height:"20px", padding:"0 10px 0 10px"}}/>Having Problems with Spotify?</h5></div>
                        <button className="textButton" onClick={CreateSpotifyToken}>Try Logging in Again</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export {Bar, Settings}