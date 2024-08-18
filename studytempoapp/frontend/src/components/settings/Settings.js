import {CreateSpotifyToken} from "../player/PlayerAuth";
import React, {useEffect, useState} from "react";
import {CurrentlyPlaying, UserPlaylists, UserProfile} from "../player/PlaybackSDK";
import {usePlayerDevice, useSpotifyPlayer} from "react-spotify-web-playback-sdk";
import {YouTubeInput} from "../youtube/YouTube";

function Toggle(key, value, set) {
    let tf = null
    if (key === "screenMode") {
        tf = value === "spotify" ? "youtube" : "spotify";
    }
    else {
        tf = value === "false" ? "true" : "false";
    }
    set(tf);

    localStorage.setItem(key, tf);
}

// control visibility + refresh
function HideControls() {
    document.getElementById("Bar").classList.add("hideOpacity");
    document.getElementById("TimerControl").classList.add("hideOpacity");
    document.getElementById("Logo").classList.add("hideOpacity");
    document.getElementById("Player").classList.add("hideOpacity");
    try {
        document.getElementById("Playlist").classList.add("hideOpacity");
    } catch {}
    document.getElementById("YouTube").classList.add("max");
    document.documentElement.style.cursor = "none";
}

function ShowControls() {
    screenIdleTime = 0
    document.getElementById("Bar").classList.remove("hideOpacity");
    document.getElementById("TimerControl").classList.remove("hideOpacity");
    document.getElementById("Logo").classList.remove("hideOpacity");
    document.getElementById("Player").classList.remove("hideOpacity");
    try {
        document.getElementById("Playlist").classList.remove("hideOpacity");
    } catch {}
    document.getElementById("YouTube").classList.remove("max");
    document.documentElement.style.cursor = "auto";
}

document.addEventListener("mousemove", ShowControls);
document.addEventListener("touchstart", ShowControls);
document.addEventListener("scroll", ShowControls);
document.addEventListener("click", ShowControls);

let screenIdleTime = 0
const screenIdleMax = 7 // timeout after 7 secs

function CheckIdleTime() {
    screenIdleTime++;
    if (screenIdleTime >= screenIdleMax) {
        HideControls();
    }
}
// username submission handling
const onSubmitUsername = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const username = formData.get("username");

    localStorage.setItem("username", username.toString());
}

// greetings
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
        quotes = ["Let's get sh*t done.", "Who's gonna carry the boats?", "3 milk buckets, 2 sugar, 1 egg, and 3 wheat",
                "Better than punching wood :)", "Show'em who's boss.", "Wakey Wakey Lil' Princess.",
                "Awesome!", "May contain nuts!", "Holy cow!", "So fresh, so clean!"]
    }
    else if (now === "Good Afternoon") { // Afternoon
        quotes = ["Remember to drink water!", "A lil' coffee break 💅🏻...then back to work", "They don't know you son.",
                "Maybe try a different approach?", "Take a little time to pat yourself on the back :)", "Yes, sir!",
                "Some quotes here are from a block game :>", "Throughout Heaven and Earth, you are the studious one.",
                `Is that...${localStorage.getItem("username")}?!!!`, "a^2+b^2=c^2", "9x-7i > 3(3x-7u)" ]
    }
    else { // Night
        quotes = ["Who needs sleep anyways?", "What a beast!", "Keep pushing!", "Stay hard!",
                "Play him off, keyboard cat!", "!!!1!", "You could be mining for diamonds rn",
                "Would you like some coffee?", "Its C btw", "Remember +C!"]
    }
    useEffect(() => {
        setQuote(quotes[Math.floor(Math.random()*quotes.length)]);
    }, []);
    return quote;
}

// settings
const Settings = (
    {
        API_URL,
        breakTime, setBreakTime,
        darkPref, setDarkPref,
        showTODO, setShowTODO,
        breakToggle, setBreakToggle,
        autoRestart, setAutoRestart,
        volume, setVolume,
        timerPing, setTimerPing,
        shuffle, setShuffle,
        screenLockToggle, setScreenLockToggle,
        username,
        setYoutubeURL,
        militaryTime, setMilitaryTime
    }) => {
    const device = usePlayerDevice();
    const player = useSpotifyPlayer();
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
        <div className={`${darkPref === "true" ? "bg-gray-200" : "bg-white"} grid grid-cols-2 pt-10`}>
            <div className="flex flex-col p-4">
                <div className="text-3xl font-bold pb-4"><h1>Settings</h1></div>
                <h5 className="text-2xl font-semibold">UI</h5>
                <div id="UISettings" className="flex flex-col text-xl pl-4 gap-y-2 pb-2 font-bold text-gray-600">
                    <div className="flex items-center">
                        <h5>Keep Screen On</h5>
                        <label className="switch">
                            <input type="checkbox" onChange={() => Toggle("screenLockToggle", screenLockToggle, setScreenLockToggle)} checked={screenLockToggle === "true"}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="flex items-center">
                        <h5>Show TODO ✏️</h5>
                        <label className="switch">
                            <input type="checkbox" onChange={() => Toggle("showTODO", showTODO, setShowTODO)} checked={showTODO === "true"}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="flex items-center">
                        <h5>Military Time</h5>
                        <label className="switch">
                            <input type="checkbox" onChange={() =>
                                {Toggle("militaryTime", militaryTime, setMilitaryTime);
                                window.location.reload()}
                            } checked={militaryTime === "true"}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="flex items-center">
                        <h5>Dark Mode</h5>
                        <label className="switch">
                            <input type="checkbox" onChange={() => Toggle("darkPref", darkPref, setDarkPref)} checked={darkPref === "true"}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
                <h5 className="text-2xl font-bold pb-2">Timer</h5>
                <div id="TimerSettings" className="flex flex-col text-xl pl-4 gap-y-2 pb-2 font-bold text-gray-600">
                    <div className="flex items-center">
                        <h5>Auto-Restart</h5>
                        <label className="switch">
                            <input type="checkbox" onChange={() => Toggle("autoRestart", autoRestart, setAutoRestart)} checked={autoRestart === "true"}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="flex items-center">
                        <h5>Break ☕️</h5>
                        <label className="switch">
                            <input type="checkbox" onChange={() => Toggle("breakToggle", breakToggle, setBreakToggle)} checked={breakToggle === "true"}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className={breakToggle === "true" ? "flex items-center" : "hide"}>
                        <h5>Break-Time</h5>
                        <input type="range" min="0.5" max="30" defaultValue={breakTime} step="0.5" className="range"
                               onChange={breakTimeSlider => {setBreakTime(breakTimeSlider.target.value); localStorage.setItem("breakTimePref", breakTimeSlider.target.value);}}/>
                        <h5 id="BreakTime">{breakTime} Minutes</h5>
                    </div>
                </div>
                <h5 className="text-2xl font-bold pb-2">Sound</h5>
                <div id="SoundSettings" className="flex flex-col text-xl pl-4 gap-y-2 pb-2 font-bold text-gray-600">
                    <div className="flex items-center">
                        <h5>Volume</h5>
                        <input type="range" min="0" max="1" defaultValue={volume} step="0.01" className="range"
                               onChange={volumeSlider => {setVolume(volumeSlider.target.value); localStorage.setItem("volume", volumeSlider.target.value); player.setVolume(Math.round(volume*100)/100)}}/>
                        <h5>{Math.round(volume * 100)}%</h5>
                    </div>
                    <div className="flex">
                        <h5>Timer Ping</h5>
                        <label className="switch">
                            <input type="checkbox" onChange={() => Toggle("timerPing", timerPing, setTimerPing)} checked={timerPing === "true"}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
                <h5 className="text-2xl font-bold pb-2">Change/Login</h5>
                <div id="Login Settings" className="flex flex-col text-xl pl-4 pb-2 font-bold text-gray-600">
                    <button className="w-fit hover:bg-red-600 hover:text-white rounded-xl p-1 -ml-1" onClick={() => CreateSpotifyToken()}>Re-Login to Spotify</button>
                    <button className="w-fit hover:bg-red-600 hover:text-white rounded-xl p-1 -ml-1" onClick={() => {
                        localStorage.setItem("username", "");
                        window.location.reload()
                    }}>Change Name</button>
                </div>
            </div>
            <div className="flex flex-col p-4">
                <h1 className="font-bold text-3xl">{GoodGreeting()}, {username ? username : ":>"}</h1>
                <h6 className="text-lg">{GreetingQuote()}</h6>
                <div className="flex flex-col py-5 gap-y-2">
                    <div className={device === null ? "" : "hide"}>
                        <UserProfile API_URL={API_URL}/>
                    </div>
                    <div className={device === null ? "hide" :  ""}>
                        <CurrentlyPlaying darkPref={darkPref} shuffle={shuffle} setShuffle={setShuffle}/>
                        <UserPlaylists shuffle={shuffle} API_URL={API_URL} darkPref={darkPref}/>
                    </div>
                    <YouTubeInput setYoutubeURL={setYoutubeURL}/>
                </div>
            </div>
        </div>
    );
}
export {Settings, CheckIdleTime}