import React, {useEffect, useState} from "react";
import "./Spotify.css";
import Visualizer from "./visualizer.gif";

function CurrentlyPlaying() {
    const [currentlyPlaying, setCurrentlyPlaying] = useState();
    const [visualizerVisibility, setVisualizerVisibility] = useState();

    useEffect(() => {
        setInterval(() => {
            fetch("http://localhost:8080/api/user-currently-playing")
                .then(response => response.text())
                .then(data => {
                    if(data) {
                        setVisualizerVisibility("show");
                    } else {
                        setVisualizerVisibility("hide");
                    }
                    let trimmedSong = data.replace(/^(.{40}[^\s]*).*/, "$1") + "\n";
                    setCurrentlyPlaying(trimmedSong);
                })
        }, 2000)

    }, []);

    return(
        <div className="playing">
            <img src={Visualizer} className={visualizerVisibility}/>
            <h5>{currentlyPlaying}</h5>
        </div>
    );
}
export {CurrentlyPlaying};