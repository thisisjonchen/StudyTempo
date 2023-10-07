import "./clock/Clock.css";
import "./App.css";
import SpotifyLogin from "./spotify/SpotifyLogin";
import SpotifyLogo from "./spotify/SpotifyLogo.png";
import CurrentlyPlaying from "./spotify/CurrentlyPlaying";
import Clock from "./clock/Clock";

function App() {
  return (
      <div>
          <div className="container">
            <div className="clock">
                <h1 className="tagline">It is currently</h1>
                <Clock />
            </div>
          </div>
          <div className="login">
             <button onClick={SpotifyLogin} className="SpotifyLogin"><img src={SpotifyLogo} className="SpotifyLogo"/>Login to Spotify</button>
          </div>
      </div>
  );
}
export default App;
