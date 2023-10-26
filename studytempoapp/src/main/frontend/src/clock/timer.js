import TimerIcon from "../assets/timer.png";
import React from "react";
const timerRenderer = ({minutes, seconds, completed}) => {
    const minute = ("0"+minutes).slice(-2);
    const second = ("0"+seconds).slice(-2);
    if (completed) {
        return ""
    } else {
        return (
            <h5 className="centered">
                <img src={TimerIcon} className="timerIcon"/><span>{minute}</span>:<span className="secondTimer">{second}</span>
            </h5>
        );
    }
}

export {timerRenderer}