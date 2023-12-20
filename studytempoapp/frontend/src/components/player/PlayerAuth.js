import {useState} from "react";

const API_URL = "https://studytempo.co";
function CreateSpotifyToken() {
    try {
        fetch(`${API_URL}/auth/login`)
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

function IsLoggedIn() {
    const [isLoggedIn, setStatus] = useState("");
    fetch(`${API_URL}/auth/is-token-valid`)
        .then((response) => response.text())
        .then(response => {
            setStatus(response)
        })
    return isLoggedIn;
}

export {CreateSpotifyToken, IsLoggedIn};
