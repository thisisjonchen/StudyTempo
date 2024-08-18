import React, { useCallback } from 'react';
import StudyTempoLogo from "../../assets/st-logo.png";
import Countdown, { calcTimeDelta } from "react-countdown";
import { TimerRenderer } from "../clock/timer";
import GeminiIcon from "../../assets/google-gemini-icon.png";
import LightIcon from "../../assets/light-mode.png";
import DarkIcon from "../../assets/dark-mode.png";
import DisplayOneIcon from "../../assets/display-1.png";
import DisplayTwoIcon from "../../assets/display-2.png";
import MinimizeIcon from "../../assets/minimize.png";
import FullscreenIcon from "../../assets/fullscreen.png";

const Toggle = (key, value, set) => {
    const tf = key === "screenMode"
        ? (value === "spotify" ? "youtube" : "spotify")
        : (value === "false" ? "true" : "false");
    set(tf);
    localStorage.setItem(key, tf);
};

const Header = (
    {
        volume,
        timerPing,
        countdownApi,
        setTimerMode,
        breakToggle,
        autoRestart,
        timerValue,
        darkPref,
        setDarkPref,
        isFullScreen,
        setFullScreen,
        handle,
        screenMode,
        setScreenMode,
        setRef,
        handleTimerStop,
        timer,
        setTimer,
        timerMode,
        setGemini,
        gemini
    }) => {
    const handleFullScreenToggle = useCallback(() => {
        if (isFullScreen) {
            handle.exit();
        } else {
            handle.enter();
        }
        setFullScreen(!isFullScreen);
    }, [isFullScreen, setFullScreen, handle]);

    const handleDarkPrefToggle = useCallback(() => {
        Toggle("darkPref", darkPref, setDarkPref);
    }, [darkPref, setDarkPref]);

    const handleScreenModeToggle = useCallback(() => {
        Toggle("screenMode", screenMode, setScreenMode);
    }, [screenMode, setScreenMode]);

    return (
        <div id="Header" className="flex z-50">
            <div id="Logo" className="logo">
                <button className="flex items-center gap-x-2 opacity-60">
                    <img alt="StudyTempo Logo" src={StudyTempoLogo} className="w-5 h-auto"/>
                    <h3 className="text-2xl"><span className="font-bold">Study</span>Tempo</h3>
                </button>
            </div>
            <div className="flex justify-center w-full">
                <Countdown
                    date={timer}
                    autoStart={false}
                    overtime={true}
                    renderer={props =>
                        <TimerRenderer
                            minutes={calcTimeDelta(timer).minutes}
                            seconds={calcTimeDelta(timer).seconds}
                            completed={calcTimeDelta(timer).completed}
                            volume={volume}
                            timerPing={timerPing}
                            countdownApi={countdownApi}
                            setTimer={setTimer}
                            timerMode={timerMode}
                            setTimerMode={setTimerMode}
                            breakToggle={breakToggle}
                            autoRestart={autoRestart}
                            timerValue={timerValue}
                        />
                    }
                    ref={setRef}
                    onStop={handleTimerStop}
                />
            </div>
            <div id="Bar" className="flex ml-auto align-middle gap-x-4">
                <button onClick={() => setGemini(!gemini)} className="drop-shadow-md">
                    <img className="max-h-8" alt="Gemini AI Button" src={GeminiIcon}/>
                </button>
                <button onClick={handleDarkPrefToggle}>
                    <img alt="Dark Mode Button" src={darkPref === "true" ? LightIcon : DarkIcon} className="opacity-60 max-h-8 invert"/>
                </button>
                <button onClick={handleScreenModeToggle}>
                    <img alt="Screen Mode Button" src={screenMode === "spotify" ? DisplayTwoIcon : DisplayOneIcon} className="opacity-60 max-h-8 invert"/>
                </button>
                <button onClick={handleFullScreenToggle}>
                    <img alt="Full Screen Button" src={isFullScreen ? MinimizeIcon : FullscreenIcon} className="opacity-60 max-h-8 invert"/>
                </button>
            </div>
        </div>
    );
};

export default Header;