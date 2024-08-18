const API_URL = process.env.REACT_APP_API_URL;

// sends request to backend, which then returns an url for user to log in with
// should only happen once (or until they log in again)
function CreateSpotifyToken() {
    try {
        fetch(`${API_URL}/auth/login`)
            .then(response => response.text())
            .then(response => {
                window.location = response;
            })
    }
    catch (err) {
            console.log(err)
        }
}

function RefreshAuthToken() {
    try {
        fetch(`${API_URL}/auth/get-auth-token`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": "true"
                }}
        )
        console.log("refreshed!");
    }
    catch (err) {
        console.log(err)
    }
}

// thanks w3 schools :>
function getCookie(cookie) {
    const name = cookie + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for(let i = 0; i < cookieArray.length; i++) {
        let c = cookieArray[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "false";
}

export {CreateSpotifyToken, getCookie, RefreshAuthToken};
