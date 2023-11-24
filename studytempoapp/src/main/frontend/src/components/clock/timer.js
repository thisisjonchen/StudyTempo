import TimerIcon from "../../assets/timer.png";
import React from "react";

function CountdownControl({setTimer, countdownApi}) {
    return (
        <div id="TimerControl" className="timerControl">
            <button onClick={() => {setTimer(Date.now() + 900000); countdownApi?.stop();}}>15</button>
            <button onClick={() => {setTimer(Date.now() + 1500000); countdownApi?.stop();}}>25</button>
            <button onClick={() => {setTimer(Date.now() + 1800000); countdownApi?.stop();}}>30</button>
            <button onClick={() => {setTimer(Date.now() + 2700000); countdownApi?.stop();}}>45</button>
            <button id="timerStart" className="startButton" onClick={countdownApi?.start}>Start</button>
            <button id="timerStart" className="stopButton" onClick={() => {setTimer(0)}}>C</button>
        </div>
    )
}

function TimerRenderer({minutes, seconds, completed, setTimer, breakToggle}) {
    const minute = ("0"+minutes).slice(-2);
    const second = ("0"+seconds).slice(-2);
    if (minutes === 0 && seconds === 5) {
        document.getElementById("StudyTempo").className="alert";
    }
    if (minutes === 0 && seconds === 1) {
        if (breakToggle === "true" && document.getElementById("Timer").className === "timer") {
            document.getElementById("StudyTempo").className="break";
            setTimeout(function () {
                setTimer(Date.now() + (localStorage.getItem("breakTimePref") * 60000));
                document.getElementById("Timer").className="timerBreak";
                if (localStorage.getItem("darkPref") === "true") {
                    document.getElementById("StudyTempo").className="dark";
                } else {
                    document.getElementById("StudyTempo").className="light";}
            }, 990)
        } else {
            document.getElementById("StudyTempo").className="stop";
            setTimeout(function () {
                if (localStorage.getItem("darkPref") === "true") {
                    document.getElementById("StudyTempo").className="dark";
                } else {
                    document.getElementById("StudyTempo").className="light";}
            }, 1000)
        }
    }
    if (completed) {
        return "";
    } else {
        return (
            <h5 id="Timer" className="timer">
                <img src={TimerIcon} className="timerIcon"/><span>{minute}</span>:<span className="secondTimer">{second}</span>
            </h5>
        );
    }
}
export {TimerRenderer, CountdownControl}