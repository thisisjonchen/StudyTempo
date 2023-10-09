import SpotifyLogo from "./SpotifyLogo.png";

function SpotifyLogin() {
    fetch("http://localhost:8080/api/login")
        .then((response) => response.text())
        .then(response => {
            window.location = response;
            localStorage.setItem("SpotifyBtnShow", "false");
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

function SpotifyLoginCheck() {
    const SpotifyBtn = document.getElementById("SpotifyLoginBtn")
    if (localStorage.getItem("SpotifyBtnShow") === "false") {
        SpotifyBtn.remove();
    }
}

export {SpotifyLogin, SpotifyLoginCheck};
