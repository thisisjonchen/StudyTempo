import StudyTempoLogo from "../../assets/stlogo.png";

function Welcome({setUsername}) {
    const onSubmitUsername = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const username = formData.get("username");

        localStorage.setItem("username", username.toString());
        setUsername(username);
        
        window.location.reload();
    }

    return (
        <div className="welcome">
            <div className="stack">
                <img src={StudyTempoLogo} className="welcomeIcon"/>
                <h5>Welcome to</h5>
                <h1>StudyTempo</h1>
                <form className="stack" onSubmit={onSubmitUsername}>
                    <label>
                        <input type="text" name="username" placeholder="What's your name?"/>
                    </label>
                </form>
            </div>
        </div>
    )
}

export {Welcome}