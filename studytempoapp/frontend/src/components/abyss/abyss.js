import React from "react";
import "./abyss.css"

function Abyss() {
    return (
        <>
            <div className="pit">
                <div className="abyssSectionL">
                    <h5 className="credits"><button className="textButton" onClick={() => window.open("https://ko-fi.com/thisisjonchen")}>Support me</button> :)</h5>
                    <h5 className="credits">Made with hatred by <button className="textButton" onClick={() => window.open("https://github.com/thisisjonchen")}>Jon Chen</button> :></h5>
                </div>
                <div className="abyssSectionR">
                    <h5 className="credits"><button className="textButton">GitHub</button> ← Chuck suggestions here</h5>
                </div>
            </div>
            <div className="abyss"/>
            <div className="abyssCover"/>
        </>
    )
}

export default Abyss;