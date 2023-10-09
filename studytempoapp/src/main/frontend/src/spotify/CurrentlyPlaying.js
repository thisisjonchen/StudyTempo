import {useEffect, useState} from "react";
import "./Spotify.css";

function CurrentlyPlayingSong() {
    const [currentlyPlaying, setCurrentlyPlaying] = useState();

    useEffect(() => {

        setInterval(() => {
            fetch("http://localhost:8080/api/user-currently-playing")
                .then(response => response.text())
                .then(data => {
                    console.log(data);
                    setCurrentlyPlaying(data);
                })
        }, 2000)

    }, []);

    return(
        <div>
            <h5>{currentlyPlaying}</h5>
        </div>
    );
}

export {CurrentlyPlayingSong};