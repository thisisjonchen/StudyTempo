import {useCallback, useState} from "react";

function CreateSpotifyToken() {
    try {
        fetch("http://localhost:8080/auth/login")
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
    fetch("http://localhost:8080/auth/is-token-valid")
        .then((response) => response.text())
        .then(response => {
            setStatus(response)
        })
    return isLoggedIn;
}

function RefreshSpotifyToken() {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Origin": "*"
    }

    try {
        fetch("http://localhost:8080/auth/refresh-token", {
            method: "POST",
            headers: headers
        })
    }
    catch (err) {console.log(err)}
}

function GetAuthToken() {
    return useCallback(callback => callback(
        fetch("http://localhost:8080/auth/get-token")
            .then((response) => response.text())
            .then(response => {
                return response;
            })), []);
}

export {CreateSpotifyToken, RefreshSpotifyToken, GetAuthToken, IsLoggedIn};
