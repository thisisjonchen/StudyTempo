import "./clock/Clock.css";
import "./App.css";
import {SpotifyLogin, SpotifyLoginCheck} from "./spotify/SpotifyLogin";
import SpotifyLogo from "./spotify/SpotifyLogo.png";
import Visualizer from "./spotify/visualizer.gif";
import {CurrentlyPlayingSong} from "./spotify/CurrentlyPlaying";
import Clock from "./clock/Clock";

function App() {
  return (
      <div>
          <div className="container">
            <div className="clock">
                <Clock />
                <div className="playing">
                    <CurrentlyPlayingSong />
                    <img src={Visualizer} className="visualizer"/>
                </div>
            </div>
          </div>
          <div className="spotify">
              <button id="SpotifyLoginBtn" onClick={SpotifyLogin} onLoad={SpotifyLoginCheck} className="SpotifyLogin"><img src={SpotifyLogo} className="SpotifyLogo"/>Login to Spotify</button>
          </div>
      </div>
  );
}
export default App;
