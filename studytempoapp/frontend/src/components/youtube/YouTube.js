import React from "react";
import YouTubeLogo from "../../assets/youtube-logo.png"

const YouTube = ({darkPref, youtubeURL}) => {
    return (
        <div id="YouTube" className={`${darkPref === "true" ? "!invert !hue-rotate-180 border-[#262626]" : "border-[#d9d9d9]"} h-[65vh] relative items-center w-full border-inset border-[10px] overflow-hidden transition-all duration-500`}>
            <iframe className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2"
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${youtubeURL}?version=3&amp;loop=1&amp;rel=0&amp;playlist=${youtubeURL}`}
                    allow="autoplay; clipboard-write; encrypted-media; web-share"
                    allowFullScreen
            >
            </iframe>
        </div>
    )
}

const YouTubeInput = ({setYoutubeURL}) => {
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
            <div className="flex p-5 rounded-3xl border border-gray-500 hover:cursor-pointer items-center">
                <form onSubmit={onSubmitYTURL} className="w-full">
                    <h5 className="text-xl font-semibold">StandBy Video</h5>
                    <label className="flex gap-x-2">
                        <h6>></h6>
                        <input type="text" name="youtubeURL" placeholder="Enter YouTube URL Here" className="w-full !bg-transparent"/>
                    </label>
                </form>
                <button className="flex flex-shrink-0" onClick={() => window.open("https://www.youtube.com/")}>
                    <img alt="YouTube Logo" src={YouTubeLogo} className="w-11 ml-auto"/>
                </button>
            </div>
            <h6>ⓘ For YT sound: double click on the video and adjust volume to your preference</h6>
        </>
    )
}
export {YouTube, YouTubeInput}