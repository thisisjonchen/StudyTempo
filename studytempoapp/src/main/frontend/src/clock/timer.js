import TimerIcon from "../assets/timer.png";
import React from "react";

function CountdownControl({timer, setTimer, countdownApi}) {
    return (
        <div id="TimerControl" className="timerControl">
            <button onClick={() => {setTimer(Date.now() + 900000); countdownApi?.stop();}}>15</button>
            <button onClick={() => {setTimer(Date.now() + 1500000); countdownApi?.stop();}}>25</button>
            <button onClick={() => {setTimer(Date.now() + 1800000); countdownApi?.stop();}}>30</button>
            <button onClick={() => {setTimer(Date.now() + 2700000); countdownApi?.stop();}}>45</button>
            <button onClick={() => {setTimer(Date.now() + 3599000); countdownApi?.stop();}}>60</button>
            <button id="timerStart" className="start" onClick={countdownApi?.start}>Start</button>
            <button id="timerStart" className="stop" onClick={() => {setTimer(0)}}>C</button>
        </div>
    )
}

function timerRenderer({minutes, seconds, completed}) {
    const minute = ("0"+minutes).slice(-2);
    const second = ("0"+seconds).slice(-2);
    if (minutes === 0 && seconds === 5) {
        document.getElementById("StudyTempo").className="alert";
    }
    if (minutes === 0 && seconds === 1) {
        document.getElementById("StudyTempo").className="stop";
    }
    if (completed) {
        try {
            if (localStorage.getItem("darkPref") === "true") {
                document.getElementById("StudyTempo").className="dark";
            } else {
                document.getElementById("StudyTempo").className="light";
            }
        } catch (e) {}
        return "";
    } else {
        return (
            <h5 className="centered" style={{padding:1}}>
                <img src={TimerIcon} className="timerIcon"/><span>{minute}</span>:<span className="secondTimer">{second}</span>
            </h5>
        );
    }
}
export {timerRenderer, CountdownControl}