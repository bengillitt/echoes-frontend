"use client";

import {useState, useEffect, useRef} from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface Message {
    id: number,
    chat_id: number,
    contents: string,
    score: number,
    type: "ok"
}

export default function NewChat() {
    const [prompt, setPrompt] = useState<string>("");
    const [similarChats, setSimilarChats] = useState<Array<Message> | null>(null);
    const [error, setError] = useState("");

    const modalRef = useRef<HTMLDialogElement | null>(null);

    const router = useRouter();


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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let data = await getSimilarChats({prompt: prompt});

        modalRef.current?.showModal();

        if (data.type == "ok") {
            setSimilarChats(data);
        }
    }

    const handleNewChat = async () => {
        let data = await getNewChat({prompt: prompt});

        if (data.type == "ok") {
            console.log(data);
            router.push(`/chat/${data.chat_id}`)
        }
    }

    const hideModal = () => {
        modalRef.current?.close();
    }
    
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Ask Echoes anything..." onChange={handlePromptChange} value={prompt}></input>
                <input type="submit" value="Send!"></input>
            </form>

            <dialog ref={modalRef}>
                {similarChats == null ? <p>No Similar Chats found</p> : <div>
                        <p>We found some similar chats</p>
                        {DisplayChats(similarChats)}
                    </div>}

                    <br></br>
                    <button onClick={hideModal}>Cancel</button>
                <button onClick={handleNewChat}>Send</button>
            </dialog>

            {similarChats == null ? <></> : DisplayChats(similarChats)}
        </div>
    )
}

interface prompt {
    prompt: string,
}

function DisplayChats(chatData: Array<Message>) {
    if (chatData.length == 0) {
        return (<div></div>)
    }

    return (
        <div>
            <p>Similar Chats</p>
            <ul>
                {chatData.map((msg, index) => 
                    <li key={msg.id | index}>
                        <Link href={`/chat/${msg.chat_id}`}>{msg.contents}</Link>
                    </li>
                )}
            </ul>
        </div>
    )
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

async function getNewChat(promptData: prompt) {
    try {
    const response = await fetch('http://localhost:8080/createNewChat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Tells the backend you are sending JSON
      },
      body: JSON.stringify(promptData), // Converts your JS object to a JSON string,
      credentials: 'include',
    });

    let json = await response.json();

    if (response.ok) {
        json.type = "ok";
    } else {
        json.type = "error";
    }

    return json;
  } catch (error) {
    console.error("Error sending data:", error);
    return {error: error as string, type: "error"};
  }
}