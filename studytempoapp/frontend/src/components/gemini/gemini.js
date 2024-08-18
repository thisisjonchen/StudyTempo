import GeminiIcon from "../../assets/google-gemini-icon.png";
import React, {useState} from "react";
import SubmitArrow from "../../assets/submit-arrow.png";
import Markdown from "react-markdown";
import StudyTempoLogo from "../../assets/st-logo.png";

const API_URL = process.env.REACT_APP_API_URL;

const Gemini = ({gemini, setGemini, darkPref}) => {
    const [prompt, setPrompt] = useState('');
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);
    const username = localStorage.getItem("username")[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        const history = conversations.map(conv =>
            `User: ${conv.prompt}\nAI: ${conv.response}`
        ).join('\n\n');

        try {
            const requestBody = {
                prompt: prompt,
                conversations: "Chat History:\n" + history
            };

            const res = await fetch(`${API_URL}/gemini/prompt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await res.text();
            setConversations([...conversations, { prompt, response: data }]);
            setPrompt('');
        } catch (error) {
            console.error('Error:', error);
            setConversations([...conversations, { prompt, response: "Sorry, an error occurred while generating the response." }]);
        } finally {
            setLoading(false);
            const container = document.getElementById("Conversations");
            container.scrollTop = container.scrollHeight;
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    if (!gemini) return <div className="h-0 opacity-0"/>;

    return (
        <div id="Gemini" className="w-full h-screen p-4 absolute z-20 transition-all duration-500">
            <div className={`${darkPref === "true" ? "bg-gray-200" : "bg-white"} h-full w-full rounded-xl border-gray-500 border drop-shadow-lg p-4`}>
                <div className="w-full flex pt-4 pb-2 px-2 items-center">
                    <img alt="StudyTempo Logo" src={StudyTempoLogo} className="w-4 h-auto mr-2"/>
                    <h2 className="text-2xl"><span className="font-bold">Study</span>Chat</h2>
                    <button
                        onClick={() => setGemini(!gemini)}
                        className={`${darkPref === "true" ? "invert-0" : ""} bg-black text-white ml-auto w-8 h-8 rounded-full font-bold text-sm drop-shadow-md`}>
                        X
                    </button>
                </div>
                <div className="flex flex-col p-2 gap-y-2 h-full">
                    <div id="Conversations" className="h-full border border-gray-500 rounded-xl overflow-y-auto">
                        <div className="flex items-center pt-4 pb-2 px-4">
                            <h3 className="font-semibold text-gray-500 flex items-center">Conversations powered by
                                <span
                                    className={`bg-gradient-to-r from-purple-700 to-blue-500 text-transparent bg-clip-text px-1`}
                                    style={{ WebkitBackgroundClip: 'text' }}>
                                Gemini 1.5
                                </span>
                                <img className="h-5" alt="Gemini AI Button" src={GeminiIcon}/>
                            </h3>
                            <button className="font-bold text-white bg-red-500 rounded-full ml-auto px-2 py-1" onClick={() => setConversations([])}>
                                Clear
                            </button>
                        </div>
                        <hr className="mx-4 border-gray-400"/>
                        <span className="flex justify-center w-full p-4">
                            <p className="text-sm font-semibold text-red-600 text-center">Note: Conversations are not saved. This is only intended for quick answers.</p>
                        </span>
                        <div className="flex flex-col items-center">
                            {conversations.map((conv, index) => (
                                <div key={index} className="flex flex-col items-start w-full max-w-3xl gap-y-4 px-4 pb-4 rounded-md mx-auto">
                                    <span className="flex items-center dark:bg-gray-300 p-4 rounded-xl">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-400 mr-2">
                                            <p className="text-sm text-white font-bold">{username}</p>
                                        </div>
                                        <Markdown className="whitespace-pre-wrap">{conv.prompt}</Markdown>
                                    </span>
                                        <span className="dark:bg-blue-300 p-4 rounded-xl">
                                        <Markdown className="whitespace-pre-wrap">{conv.response}</Markdown>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div id="Input" className="h-fit pb-14">
                        <form
                            onSubmit={handleSubmit}
                            onKeyDown={handleKeyDown}
                            className="w-full flex flex-col border border-gray-500 rounded-xl"
                        >
                            <label className="font-semibold text-gray-500 pt-4 pl-4 pb-2">Input</label>
                            <hr className="mx-4 border-gray-400"/>
                            <div className="flex items-center">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="What's on your mind?"
                                    className="w-full h-full !bg-transparent p-4"
                                />
                                <button
                                    type="submit"
                                    className="bg-black disabled:opacity-0 disabled:w-0 disabled:h-0 disabled:mx-0 mx-4 w-12 h-12 rounded-xl justify-center items-center flex transition-all"
                                    disabled={loading || !prompt.trim()}
                                >
                                    <img src={SubmitArrow} alt="Submit" className="h-6 w-6"/>
                                </button>
                                {loading && <div className="animate-spin mx-4 h-12 w-12 border-b-2 border-gray-900 rounded-full"/>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Gemini;