import {CurrentSong} from "./CurrentlyPlaying";

function CreateSpotifyToken() {
    try {
        fetch("http://localhost:8080/api/login")
            .then((response) => response.text())
            .then(response => {
                window.location = response;
                setInterval(RefreshSpotifyToken, 3500000)
            })
    }
    catch (err) {
            console.log(err)
        }
}

function RefreshSpotifyToken() {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Origin": "*"
    }

    try {
        fetch("http://localhost:8080/api/refresh-token", {
            method: "POST",
            headers: headers
        })
    }
    catch (err) {
        console.log(err)
    }
    setInterval(RefreshSpotifyToken, 3500000)
}

export {CreateSpotifyToken, RefreshSpotifyToken};
