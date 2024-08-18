import React from "react";

const Abyss = ({darkPref}) => {
    return (
        <>
            <div className={`${darkPref === "true" ? "bg-gray-200" : "bg-white"} grid grid-cols-2 p-4`}>
                <div className="flex flex-col items-start">
                    <button className="hover:cursor-pointer hover:underline text-lg" onClick={() => window.open("https://github.com/thisisjonchen")}>Made with ❤️ by Jon Chen</button>
                    <button className="hover:cursor-pointer hover:underline text-lg"  onClick={() => window.open("https://ko-fi.com/thisisjonchen")}>Support me</button>
                </div>
                <div className="flex flex-col items-start">
                    <button className="hover:cursor-pointer hover:underline text-lg" onClick={() => window.open("https://github.com/thisisjonchen/StudyTempo/")}>GitHub</button>
                    <button className="hover:cursor-pointer hover:underline text-lg" onClick={() => window.open("https://github.com/thisisjonchen/StudyTempo/blob/main/Cookies.md")}>Cookies</button>
                </div>
            </div>
            <div className="h-[30vh] bg-[radial-gradient(circle_at_2px_2px,rgb(0,0,0)_2px,transparent_0)] bg-[length:25px_25px] -z-10"></div>
            <div className={`${darkPref === "true" ? "from-gray-200 via-75%" : "from-white via-75%"} mt-[-30vh] h-[30vh] bg-gradient-to-b to-transparent z-2`}/>
        </>
    )
}

export default Abyss;