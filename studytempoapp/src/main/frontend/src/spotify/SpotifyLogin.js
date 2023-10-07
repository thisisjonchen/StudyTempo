function SpotifyLogin() {
    fetch("http://localhost:8080/api/login")
        .then((response) => response.text())
        .then(response => {
            window.location = response;
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}
export default SpotifyLogin;