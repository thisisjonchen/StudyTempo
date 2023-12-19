import {useState} from "react";

const API_URL = "http://localhost";
function CreateSpotifyToken() {
    try {
        fetch(`${API_URL}:8080/auth/login`)
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
    fetch(`${API_URL}:8080/auth/is-token-valid`)
        .then((response) => response.text())
        .then(response => {
            setStatus(response)
        })
    return isLoggedIn;
}

function RefreshSpotifyToken() {
    try {
        fetch(`${API_URL}:8080/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })
    }
    catch (err) {console.log(err)}
}

export {CreateSpotifyToken, RefreshSpotifyToken, IsLoggedIn};
