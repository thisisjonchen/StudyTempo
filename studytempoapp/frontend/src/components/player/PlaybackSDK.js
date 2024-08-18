import {usePlaybackState, usePlayerDevice, useSpotifyPlayer} from "react-spotify-web-playback-sdk";
import React, {useEffect, useState} from "react";
import Visualizer from "./icons/visualizer.gif";
import PlayIcon from "./icons/playicon.png";
import PauseIcon from "./icons/pauseicon.png";
import SkipBackIcon from "./icons/skipbackicon.png";
import SkipNextIcon from "./icons/skipnexticon.png";
import ShuffleToggle from "./icons/shuffleicon.png";
import SpotifyLogo from "../../assets/spotify-logo.png";
import {CreateSpotifyToken, getCookie} from "./PlayerAuth";

const spotifyLoggedIn = getCookie("spotifyLoggedIn");

// returns and displays current song
const CurrentSong = () => {
    const playbackState = usePlaybackState();
    if (playbackState === null) return null;
    const currentSong = playbackState.track_window.current_track.name
        .replace(/^(.{40}[^\s]*).*/, "$1") // limits char count to 40
        .split("(From")[0] // removes all including and after "(From
        .split("(from")[0] // removes all including and after "(from
        .split("(feat")[0] // removes all including and after "(feat
        .split("[The")[0] // removes all including and after "(feat
        .replace(/,$/, ""); // removes comma at end if needed
    const currentSongURI = playbackState.track_window.current_track.uri.split(":")[2];
    const currentArtists = playbackState.track_window.current_track.artists;
    const currentArtistURI = currentArtists[0].uri.split(":")[2];

    return (
        <div className="flex flex-col items-center mt-2">
            <div className="flex gap-x-2 items-baseline">
                <img alt="Audio Visualizer" src={Visualizer} id="Visualizer" className={playbackState.paused === true ? "hide" : "w-6 invert"}/>
                <h5 onClick={() => window.open(`https://open.spotify.com/track/${currentSongURI}`)} className="font-semibold text-xl hover:cursor-pointer">{currentSong}</h5>
            </div>
            <h6 onClick={() => window.open(`https://open.spotify.com/artist/${currentArtistURI}`)} className="hover:cursor-pointer">{currentArtists[0].name}</h6>
        </div>
    );
}

// returns and displays current playlist
const CurrentPlaylist = ({darkPref}) => {
    const playbackState = usePlaybackState();
    if (playbackState === null) return null;
    return (
        <div id="Playlist" className={`${darkPref === "true" ? "!invert !hue-rotate-180" : ""} flex hover:cursor-pointer gap-x-2`}>
                    <img alt="Playlist Image"
                         src={localStorage.getItem("playlistName") === "" ? playbackState.track_window.current_track.album.images[0].url : localStorage.getItem("playlistIMGUrl")}
                         className={`${darkPref === "true" ? "border-gray-500" : "border-gray-500"} w-14 h-14 object-cover border`}
                         onClick={() => window.open(`https://open.spotify.com/playlist/${localStorage.getItem("playlistURI")}`)}
                    />
            <div className={`${darkPref === "true" ? "text-white" : "text-black"} justify-between flex flex-col`}>
                <h6 className="text-md">Playing from</h6>
                <h5 className="font-bold text-2xl" onClick={() => window.open(`https://open.spotify.com/playlist/${localStorage.getItem("playlistURI")}`)}>
                    {localStorage.getItem("playlistName") === "" ?  playbackState.track_window.current_track.album.name : localStorage.getItem("playlistName")}</h5>
            </div>
        </div>
    );
}

// returns and displays playback controls: skip back, pause/resume, skip forward
const PlaybackControl = () => {
    const player = useSpotifyPlayer();
    const playbackState = usePlaybackState();

    if (playbackState === null) return null;

    return (
        <div id="PlayerControl" className="flex opacity-60 items-center align-middle gap-x-10">
            <button onClick={() => player.previousTrack()}>
                <img alt="Skip Back Button" src={SkipBackIcon}/>
            </button>
            <button onClick={playbackState.paused === true ? () => player.resume() : () => player.pause()}>
                <img alt="Play/Pause Button" id="PlayPause" src={playbackState.paused === true ? PlayIcon : PauseIcon}/></button>
            <button onClick={() => player.nextTrack()}>
                <img alt="Skip Next Button" src={SkipNextIcon}/>
            </button>
        </div>
    );
}

// ! Spotify Detailed Panel: Username, Currently Playing "Pane", and User Playlist Selector
// returns and displays Spotify Profile Username
const UserProfile = ({API_URL}) => {
    const [spotifyUsername, setSpotifyUsername] = useState(localStorage.getItem("spotify-username"));
    const [isLoading, setIsLoading] = useState(false);
    const player = useSpotifyPlayer();
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchSpotifyUsername = async() => {
        setIsLoading(true);
        if (localStorage.getItem("spotifyLoggedIn") === "true") {
            await new Promise(resolve => setTimeout(resolve, 250));
            try {
                const response = await fetch(`${API_URL}/player/username`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Credentials": "true"
                    }
                });
                const username = await response.text();
                if (username.includes("{\"timestamp\"")) {
                    setSpotifyUsername("Refreshing...");
                    setTimeout(() => setRefreshKey(oldKey => oldKey + 1), 1000);
                } else {
                    setSpotifyUsername(username);
                    localStorage.setItem("spotify-username", username);
                }
            } catch (error) {
                console.error("Error fetching Spotify username:", error);
                setSpotifyUsername("Error fetching username");
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (!localStorage.getItem("spotify-username")) {
            fetchSpotifyUsername();
        }
    }, [refreshKey]);

    const handleClick = () => {
        setIsLoading(true);
        const spotifyLoggedIn = localStorage.getItem("spotifyLoggedIn");
        if (spotifyLoggedIn === "false") {
            CreateSpotifyToken();
        } else {
            player.connect().then(() => {setIsLoading(false)});
        }
    };

    return (
        <div className="flex p-6 rounded-3xl border border-gray-500 hover:cursor-pointer items-center" onClick={handleClick}>
            <div>
                {spotifyLoggedIn === "false" && <h5 className="text-xl font-semibold">Log in (Premium Only)</h5>}
                {spotifyLoggedIn === "true" &&
                    <div>
                        <h5 className="text-xl font-semibold">
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                                    Loading...
                                </div>
                            ) : (
                                spotifyUsername
                            )}
                        </h5>
                        <h6>Click here to play!</h6>
                    </div>
                }
            </div>
            <img alt="Spotify Logo" src={SpotifyLogo} className="w-10 ml-auto"/>
        </div>
    );
};

// returns and displays a "pane" containing album cover, current album, current song, current artists
const CurrentlyPlaying = ({darkPref, shuffle, setShuffle}) => {
    const playbackState = usePlaybackState();
    if (playbackState === null) return null;
    const currentSong = playbackState.track_window.current_track.name;
    const currentSongURI = playbackState.track_window.current_track.uri.split(":")[2];
    const currentAlbum = playbackState.track_window.current_track.album.name;
    const currentAlbumURI = playbackState.track_window.current_track.album.uri.split(":")[2];
    const currentArtistsArr = playbackState.track_window.current_track.artists;
    const currentArtists = currentArtistsArr.slice(0, -1).map(currentArtist => `${currentArtist.name}, `).join("") + currentArtistsArr[currentArtistsArr.length-1].name;
    const currentArtistURI = playbackState.track_window.current_track.artists[0].uri.split(":")[2];
    return (
        <div className="flex items-center p-5 border border-gray-500 rounded-3xl mb-2">
            <div className="flex items-center gap-x-4">
                <img alt="Playlist Image" src={playbackState.track_window.current_track.album.images[0].url} className={`${darkPref === "true" ? "!invert !hue-rotate-180 border-gray-500" : "border-gray-500"} h-36 w-36 object-cover border`} onClick={() => window.open(`https://open.spotify.com/album/${currentAlbumURI}`)}/>
                <div>
                    <h6 className="hover:cursor-pointer" onClick={() => window.open(`https://open.spotify.com/album/${currentAlbumURI}`)}>{currentAlbum}</h6>
                    <h5 className="hover:cursor-pointer font-bold text-2xl" onClick={() => window.open(`https://open.spotify.com/track/${currentSongURI}`)}>{currentSong}</h5>
                    <div className="hover:cursor-pointer">
                        <h6 onClick={() => window.open(`https://open.spotify.com/artist/${currentArtistURI}`)}>{currentArtists}</h6>
                    </div>
                </div>
            </div>
            <div className="flex-shrink-0 ml-auto invert">
                <button onClick={() => {
                    setShuffle(shuffle === "true" ? "false" : "true");
                    localStorage.setItem("shuffle", shuffle === "true" ? "false" : "true");
                    }}><img alt="Shuffle Button" src={ShuffleToggle} className={`${shuffle === "true" ? "bg-white rounded-full" : "invert"} p-1`}/>
                </button>
            </div>
        </div>
    )
}

// returns the list of user playlists available in their library
const UserPlaylists = ({darkPref, shuffle, API_URL}) => {
    const device = usePlayerDevice();
    const [userPlaylists, setUserPlaylists] = useState(null);
    const fetchUserPlaylists = async() => {
        if (spotifyLoggedIn === "true") {
            await new Promise(resolve => setTimeout(resolve, 1000));
            fetch(`${API_URL}/player/get-user-playlists`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Credentials": "true"
                    }
                }
            )
                .then(response => response.json())
                .then(playlists => {
                    setUserPlaylists(playlists);
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
    useEffect(() => {
        fetchUserPlaylists(); // fetch list
    }, []);
    if (device === null) return null;
    return (
        <div className={`hide-scrollbar flex flex-col h-72 overflow-y-auto p-5 border border-gray-500 rounded-3xl bg-[radial-gradient(circle_at_top_right,#1DB954,transparent_25%)] text-xl`}>
            <div className="flexx">
                <button className="absolute right-8" onClick={() => window.open("https://open.spotify.com/")}>
                    <img alt="Spotify Logo" className="h-6" src={SpotifyLogo}/>
                </button>
            </div>
            <div className={`${darkPref === "true" ? "!invert !hue-rotate-180 text-white" : " text-black"} w-full`}>
                <h5 className="font-bold text-2xl pb-2 pt-4">
                    Your Playlists
                </h5>
                <div className="flex flex-col gap-y-4">
                    {userPlaylists ? userPlaylists.items.map((playlist) => <button className={`flex items-center border border-transparent [border-image:linear-gradient(to_right,#5b5b5b,transparent_90%)_1] font-semibold gap-x-2`} key={playlist.name} onClick={() => {
                        fetch(
                            `${API_URL}/player/play-playlist`,
                            {
                                method: "PUT",
                                credentials: "include",
                                body: JSON.stringify({context_uri: playlist.uri, device_id: device.device_id, shuffle_state: shuffle === "true" ? "true" : "false"}),
                                headers: {
                                    "Content-Type": "application/json",
                                    "Access-Control-Allow-Origin": "*"
                                },
                            },
                        ).then(() => {
                            localStorage.setItem("playlistName", playlist.name);
                            localStorage.setItem("playlistURI", playlist.uri.split(":")[2]);
                            localStorage.setItem("playlistIMGUrl", playlist.images[0].url);
                        })
                        }
                    }
                    >
                        <img alt="Playlist Image" className={`w-20 h-20 object-cover`} src={playlist.images[0].url}/>
                        {playlist.name}
                    </button>) : null}
                </div>
            </div>
        </div>
    )
}

// end & export
export {CurrentSong, CurrentPlaylist, PlaybackControl, UserPlaylists, CurrentlyPlaying, UserProfile};