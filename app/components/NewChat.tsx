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
    const [isSending, setIsSending] = useState<boolean>(false);

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
        setIsSending(true);
        let data = await getNewChat({prompt: prompt});

        if (data.type == "ok") {
            console.log(data);
            router.push(`/chat/${data.chat_id}`)
        } else {
            setIsSending(false);
        }
    }

    const hideModal = () => {
        modalRef.current?.close();
    }
    
    return (
        <div className="prompt-wrapper">
            <form className="prompt-bar" onSubmit={handleSubmit}>
                <input
                    className="prompt-input"
                    type="text"
                    placeholder="Ask Echoes anything..."
                    onChange={handlePromptChange}
                    value={prompt}
                />
                <button
                    type="submit"
                    className="prompt-send-btn"
                    disabled={!prompt.trim()}
                    aria-label="Send"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </form>

            <dialog ref={modalRef}>
                {similarChats == null ? (
                    <p className="modal-empty">No similar chats found</p>
                ) : (
                    <div>
                        <p className="modal-heading">We found some similar chats</p>
                        {DisplayChats(similarChats)}
                    </div>
                )}
                <div className="modal-actions">
                    <button className="modal-btn-ghost" onClick={hideModal} disabled={isSending}>Cancel</button>
                    <button className={`modal-btn-primary${isSending ? " btn-loading" : ""}`} onClick={handleNewChat} disabled={isSending}>
                        {isSending ? (
                            <div className="typing-indicator" style={{ padding: 0 }}>
                                <span className="typing-dot" style={{ background: "currentColor" }} />
                                <span className="typing-dot" style={{ background: "currentColor" }} />
                                <span className="typing-dot" style={{ background: "currentColor" }} />
                            </div>
                        ) : "New chat"}
                    </button>
                </div>
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
        <div className="similar-section">
            <div className="similar-label">Similar Chats</div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {chatData.map((msg, index) => 
                    <li key={msg.id | index}>
                        <Link href={`/chat/${msg.chat_id}`} className="similar-chip">{msg.contents}</Link>
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