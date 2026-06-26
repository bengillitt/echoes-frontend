"use client";

import {useState, useEffect} from "react";

export default function NewChat() {
    const [prompt, setPrompt] = useState<string>("");
    const [similarChats, setSimilarChats] = useState(null);
    const [error, setError] = useState("");

    const handlePromptChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrompt(event.target.value);
    }

    useEffect(() => {
        if (prompt.trim() == "") {
            return;
        }

        const timeoutId = setTimeout(async () => {
            const data = await getSimilarChats({prompt: prompt});

            if (data.type == "error") {
                setError(data.error);
            } else {
                setSimilarChats(data);
            }

            console.log(data);
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [prompt])
    
    return (
        <div>
            <input type="text" placeholder="Ask Echoes anything..." onChange={handlePromptChange} value={prompt}></input>
            <input type="submit" value="Send!"></input>
        </div>
    )
}

interface prompt {
    prompt: string,
}

async function getSimilarChats(promptData: prompt) {
    try {
    const response = await fetch("http://localhost:8080/getSimilarChats", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(promptData)
    });

    let data = await response.json();

    if (response.ok) {
        data.type = "ok";
    } else {
        data.type = "error"; 
    }

    return data;
    } catch (error) {
        return {error: error as string, type: "error"};
    }
}