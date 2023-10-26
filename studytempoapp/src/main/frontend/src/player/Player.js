
const headers = {
    "Content-Type": "application/json",
    "Access-Control-Origin": "*"
}
function SkipNext() {
    try {
        fetch("http://localhost:8080/api/skip", {
            method: "POST",
            headers: headers
        })
    }
    catch (err) {
        console.log(err)
    }
}

function SkipBack() {
    try {
        fetch("http://localhost:8080/api/back", {
            method: "POST",
            headers: headers
        })
    }
    catch (err) {
        console.log(err)
    }
}
function PlayPause() {
    try {
        fetch("http://localhost:8080/api/play-pause", {
            method: "PUT",
            headers: headers
        })
        GetIsPlayingOnLoad();
    }
    catch (err) {
        console.log(err)
    }
    fetch("http://localhost:8080/api/is-playing")
        .then(response => response.json())
        .then(isPlaying => {
            if(isPlaying) {
                document.getElementById("PlayPause").className = "play";
            } else {
                document.getElementById("PlayPause").className = "pause";
            }
        });
}

function GetIsPlayingOnLoad() {
    fetch("http://localhost:8080/api/is-playing")
        .then(response => response.json())
        .then(isPlaying => {
            if(isPlaying) {
                document.getElementById("PlayPause").className = "pause";
            } else {
                document.getElementById("PlayPause").className = "play";
            }
        });
}

export {SkipNext, SkipBack, PlayPause, GetIsPlayingOnLoad};