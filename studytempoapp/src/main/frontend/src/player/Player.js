const headers = {
    "Content-Type": "application/json",
    "Access-Control-Origin": "*"
}
function SkipNext() {
    try {
        fetch("http://localhost:8080/player/skip", {
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
        fetch("http://localhost:8080/player/back", {
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
        fetch("http://localhost:8080/player/play-pause", {
            method: "PUT",
            headers: headers
        })
    }
    catch (err) {
        console.log(err)
    }
}

export {SkipNext, SkipBack, PlayPause};