function CreateSpotifyToken() {
    fetch("http://localhost:8080/api/login")
        .then((response) => response.text())
        .then(response => {
            window.location = response;
            setInterval(RefreshSpotifyToken, 3500000)
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
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
