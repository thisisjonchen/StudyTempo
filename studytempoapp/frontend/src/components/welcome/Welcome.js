import StudyTempoLogo from "../../assets/st-logo.png";
import React from "react";

const Welcome = ({setUsername}) => {
    const onSubmitUsername = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const username = formData.get("username");

        localStorage.setItem("username", username.toString());
        setUsername(username);
        
        window.location.reload();
    }

    return (
        <div className="flex w-full h-screen items-center justify-center">
            <div className="flex flex-col gap-y-4">
                <div className="flex flex-col items-center">
                    <img alt="StudyTempo Logo" src={StudyTempoLogo} className="w-20 pb-4"/>
                    <h4>Welcome to</h4>
                    <h3 className="text-2xl"><span className="font-bold">Study</span>Tempo</h3>
                </div>
                <form className="flex flex-col" onSubmit={onSubmitUsername}>
                    <label>
                        <input className="text-center rounded-xl" type="text" name="username" placeholder="What's your name?"/>
                    </label>
                </form>
            </div>
        </div>
    )
}

export {Welcome}