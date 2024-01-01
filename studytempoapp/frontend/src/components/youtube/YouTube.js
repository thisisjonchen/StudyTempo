import React from "react";
import "./YouTube.css";
import YouTubeLogo from "../../assets/YouTubeLogo.png"

function YouTube({screenMode, youtubeURL}) {
    return (
        <div id="YouTube" className={screenMode === "youtube" ? "youtubeMin" : "hide"}>
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${youtubeURL}?version=3&amp;loop=1&amp;playlist=${youtubeURL}`} title="StandBy Video Player (YouTube)" allow="autoplay; clipboard-write; encrypted-media; web-share" allowFullScreen></iframe>
        </div>
    )
}

function YouTubeInput({setYoutubeURL}) {
    const onSubmitYTURL = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const url = formData.get("youtubeURL").toString();

        try {
            let formattedURL;
            if (url.includes("live")) {
                formattedURL = url.split("/")[4].split("?")[0]; // retrieves LIVE video ID
            }
            else {
                formattedURL = url.split("/")[3].split("?")[0]; // retrieves video ID
            }
            localStorage.setItem("youtubeURL", formattedURL.toString());
            setYoutubeURL(formattedURL.toString());
        }
        catch (e) {
            console.log("Not valid URL")
        }
    }

    return (
        <>
            <div className="loginTab youtubeTab">
                <form onSubmit={onSubmitYTURL}>
                    <h5>StandBy Video</h5>
                    <label className="centeredH">
                        <h6>></h6>
                        <input type="text" name="youtubeURL" placeholder="Share → Copy URL → Enter YouTube URL Here :)"/>
                    </label>
                </form>
                <button onClick={() => window.open("https://www.youtube.com/")}><img alt="YouTube Logo" src={YouTubeLogo} className="icon"/></button>
            </div>
                <h6 style={{fontWeight:"bold"}}>ⓘ For YT sound: double click on the video and adjust volume to your preference</h6>
        </>
    )
}
export {YouTube, YouTubeInput}