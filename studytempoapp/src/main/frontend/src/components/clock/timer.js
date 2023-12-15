import TimerIcon from "../../assets/timer.png";
import Ping from "../../assets/ping.mp3";
import React, {useState} from "react";
import {zeroPad} from "react-countdown";
import useSound from "use-sound";

function CountdownControl({setTimer, countdownApi}) {
    const [timerValue, setTimerValue] = useState(0)
    return (
        <div id="TimerControl" className="timerControl">
            <button onClick={() => {setTimerValue(10000); setTimer(Date.now() + 10000); countdownApi?.stop();}}>15</button>
            <button onClick={() => {setTimerValue(1500000); setTimer(Date.now() + 1500000); countdownApi?.stop();}}>25</button>
            <button onClick={() => {setTimerValue(1800000); setTimer(Date.now() + 1800000); countdownApi?.stop();}}>30</button>
            <button onClick={() => {setTimerValue(2700000); setTimer(Date.now() + 2700000); countdownApi?.stop();}}>45</button>
            <button className="startButton" onClick={() => {setTimer(Date.now() + timerValue); setTimeout(countdownApi?.start(), 1000)}}>Start</button>
            <button className="stopButton" onClick={() => {
                setTimer(0);
                countdownApi?.stop();
                try {
                    document.getElementById("Overlay").className = "overlay hide";
                    document.getElementById("Timer").className = "timer";
                }
                catch (e) {}
            }}>C</button>
        </div>
    )
}

function TimerRenderer({minutes, seconds, completed, setTimer, timerMode, setTimerMode, autoRestart, breakToggle, countdownApi, volume, timerPing}) {
    const [ping] = useSound(Ping, {volume: timerPing === "true" ? volume : 0});
    if (minutes === 0 && seconds === 5) {
        document.getElementById("Overlay").className="overlayAlert"; // flash yellow alert screen to user
        document.getElementById("Timer").className="timerAlert"; // changes timer clock to yellow
    }
    if (minutes === 0 && seconds === 1) {
        if (breakToggle === "true") { // checks if break is toggled and if timerMode is alarm
            if (timerMode === "alarm") {
                document.getElementById("Timer").className = "timerBreak"; // changes timer clock to blue
                document.getElementById("Overlay").className = "overlayBreak"; // flash blue break screen to user
                ping();
                setTimeout(function () {
                    setTimer(Date.now() + (localStorage.getItem("breakTimePref") * 60000)); // sets timer to break time pref in settings
                    setTimeout(countdownApi?.start(), 500)
                    document.getElementById("Overlay").className = "overlayHide";
                    setTimerMode("break")
                }, 990)
            }
            else if (autoRestart === "true" && timerMode === "break") { // checks if autoRestart is on
                document.getElementById("Timer").className = "timer";
                document.getElementById("Overlay").className = "overlayStart";
                ping();
                setTimeout(function () {
                    setTimer(Date.now() + 200000000);
                    console.log(minutes)
                    setTimeout(countdownApi?.start(), 500)
                    document.getElementById("Overlay").className = "overlayHide";
                    setTimerMode("alarm")
                }, 990)
            }
            else {
                document.getElementById("Overlay").className = "overlayStop"; // flash red stop screen to user
                document.getElementById("Timer").className = "timerStop"; // changes timer clock to red
                ping();
                setTimeout(function () {document.getElementById("Overlay").className = "overlayHide"}, 1000)
            }
        }
        else { // else if break is not toggled
            if (autoRestart === "true") { // checks if autoRestart is on
                document.getElementById("Timer").className = "timer";
                document.getElementById("Overlay").className = "overlayStart";
                ping();
                setTimeout(function () {
                    setTimer(Date.now() + 200000000);
                    setTimeout(countdownApi?.start(), 500)
                    document.getElementById("Overlay").className = "overlayHide";
                }, 990);
            }
            else {
                document.getElementById("Overlay").className = "overlayStop"; // flash red stop screen to user
                document.getElementById("Timer").className = "timerStop"; // changes timer clock to red
                ping();
                setTimeout(function () {document.getElementById("Overlay").className = "overlayHide"}, 1000)
            }
        }
    }
    if (completed) {
        return "";
    } else {
        return (
            <h5 id="Timer" className="timer">
                <img src={TimerIcon} className="timerIcon"/><span>{zeroPad(minutes)}</span>:<span className="secondTimer">{zeroPad(seconds)}</span>
            </h5>
        );
    }
}
export {TimerRenderer, CountdownControl}