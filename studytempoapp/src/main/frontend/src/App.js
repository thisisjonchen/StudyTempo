import "./clock/Clock.css";
import "./App.css";
import {SpotifyLogin, SpotifyLoginCheck} from "./spotify/SpotifyLogin";
import SpotifyLogo from "./spotify/SpotifyLogo.png";
import CurrentlyPlaying from "./spotify/CurrentlyPlaying";
import Clock from "./clock/Clock";

function App() {
  return (
      <div>
          <div className="container">
            <div className="clock">
                <Clock />
                <CurrentlyPlaying />
            </div>
          </div>
          <div className="spotify">
              <button id="SpotifyLoginBtn" onClick={SpotifyLogin} onLoad={SpotifyLoginCheck} className="SpotifyLogin"><img src={SpotifyLogo} className="SpotifyLogo"/>Login to Spotify</button>
          </div>
      </div>
  );
}
export default App;
