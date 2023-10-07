import {useEffect, useState} from "react";

function CurrentlyPlaying() {
    const[currentlyPlaying, setCurrentlyPlaying] = useState();

    useEffect(() => {
        fetch("http://localhost:8080/api/user-currently-playing")
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setCurrentlyPlaying(data)
            })
    }, []);

    return(
        <div>
            <h2>{currentlyPlaying}</h2>
        </div>
    );
}

export default CurrentlyPlaying;