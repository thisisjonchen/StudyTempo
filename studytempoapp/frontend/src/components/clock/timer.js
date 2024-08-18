import TimerIcon from "../../assets/timer.png";
import Ping from "../../assets/ping.mp3";
import React from "react";
import {zeroPad} from "react-countdown";
import useSound from "use-sound";
import "./time.css"

const CountdownControl = ({timerValue, setTimerValue, setTimer, countdownApi}) => {
    return (
        <div id="TimerControl" className="flex items-center gap-x-3 font-bold">
            <div className="flex opacity-60 gap-x-3">
                <button onClick={() => {setTimerValue(900000); setTimer(Date.now() + 900000); countdownApi?.stop();}}>15</button>
                <button onClick={() => {setTimerValue(1500000); setTimer(Date.now() + 1500000); countdownApi?.stop();}}>25</button>
                <button onClick={() => {setTimerValue(1800000); setTimer(Date.now() + 1800000); countdownApi?.stop();}}>30</button>
                <button onClick={() => {setTimerValue(2700000); setTimer(Date.now() + 2700000); countdownApi?.stop();}}>45</button>
            </div>
            <button className="text-white bg-green-500 px-2 rounded-full" onClick={() => {setTimer(Date.now() + timerValue); countdownApi?.stop(); setTimeout(countdownApi?.start(), 1000)}}>Start</button>
            <button className="text-white bg-red-500 w-6 h-6 rounded-full" onClick={() => {
                setTimer(0);
                countdownApi?.stop();
                try {
                    document.getElementById("Timer").className = "timer";
                    document.getElementById("Overlay").className = "overlay hideOpacity";
                }
                catch (e) {}
            }}>C</button>
        </div>
    )
}

const TimerRenderer = (
    {   minutes,
        seconds,
        completed,
        setTimer,
        timerMode,
        setTimerMode,
        autoRestart,
        breakToggle,
        countdownApi,
        volume,
        timerPing,
        timerValue
    }) => {
    const [ping] = useSound(Ping, {volume: timerPing === "true" ? volume : 0});
    if (minutes === 0 && seconds === 5) {
        document.getElementById("Timer").className="timer alert"; // changes timer clock to yellow
        document.getElementById("Overlay").className="overlay alert"; // flash yellow alert screen to user
    }
    if (minutes === 0 && seconds === 1) {
        if (breakToggle === "true") { // checks if break is toggled and if timerMode is alarm
            if (timerMode === "alarm") {
                document.getElementById("Timer").className = "timer break"; // changes timer clock to blue
                document.getElementById("Overlay").className = "overlay break"; // flash blue break screen to user
                ping();
                setTimeout(function () {
                    setTimer(Date.now() + (localStorage.getItem("breakTimePref") * 60000)); // sets timer to break time pref in settings
                    setTimeout(countdownApi?.start(), 500)
                    document.getElementById("Overlay").className = "overlay hideOpacity";
                    setTimerMode("break")
                }, 990)
            }
            else if (autoRestart === "true" && timerMode === "break") { // checks if autoRestart is on
                document.getElementById("Timer").className = "timer";
                document.getElementById("Overlay").className = "overlay start";
                ping();
                setTimeout(function () {
                    setTimer(Date.now() + timerValue);
                    setTimeout(countdownApi?.start(), 500)
                    document.getElementById("Overlay").className = "overlay hideOpacity";
                    setTimerMode("alarm")
                }, 990)
            }
            else {
                document.getElementById("Timer").className = "timer stop"; // changes timer clock to red
                document.getElementById("Overlay").className = "overlay stop"; // flash red stop screen to user
                ping();
                setTimeout(function () {document.getElementById("Overlay").className = "overlay hideOpacity"}, 1000)
            }
        }
        else { // else if break is not toggled
            if (autoRestart === "true") { // checks if autoRestart is on
                document.getElementById("Timer").className = "timer";
                document.getElementById("Overlay").className = "overlay start";
                ping();
                setTimeout(function () {
                    setTimer(Date.now() + timerValue);
                    setTimeout(countdownApi?.start(), 500)
                    document.getElementById("Overlay").className = "overlay hideOpacity";
                }, 990);
            }
            else {
                document.getElementById("Timer").className = "timer stop"; // changes timer clock to red
                document.getElementById("Overlay").className = "overlay stop"; // flash red stop screen to user
                ping();
                setTimeout(function () {document.getElementById("Overlay").className = "overlay hideOpacity"}, 1000)
            }
        }
    }
    if (completed) {
        return "";
    } else {
        return (
            <div id="Timer" className="timer">
                <img alt="Timer Icon" src={TimerIcon} className="w-5 h-5 mr-1 z-10 invert"/>
                <h5 className="w-15">{zeroPad(minutes)}:{zeroPad(seconds)}</h5>
            </div>
        );
    }
}
export {TimerRenderer, CountdownControl}