'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';

import Cookies from "js-cookie";

interface Props {
  params: Promise<{ id: string }>; // In modern Next.js, params is an async Promise
}

interface Message {
    id: number,
    contents: string,
    message_role: number,
    position: number,
}

interface Chat {
    type: "chat"
    id: number,
    user_id: number,
    messages: Array<Message>,
    feedback: number,
}

interface ErrorMessage {
    type: "error",
    error: string,
}

interface LoadingMessage {
    type: "loading",
    message: string,
}

export default function ChatPage({ params }: Props) {
    const [chat, setChat] = useState<Chat | ErrorMessage | LoadingMessage>({type: "loading", message: "Fetching chat..."});
    const [prompt, setPrompt] = useState<string>("");
    const [isSending, setIsSending] = useState<boolean>(false);

    const [update, setUpdate] = useState<boolean>(false);

    const router = useRouter();

    const { id } = use(params);

    useEffect(() => {
        async function load_chat() {
            setChat(await handle_chat({ id: +id }));
        }

        load_chat();
    }, [update])

    async function send_chat_continuation() {
        const token = Cookies.get("token");

        console.log("Token = ", token);

        setIsSending(true);

        let new_chat_id = await handle_chat_continuation({
            chat_id: +id,
            token: token as string,
            prompt: prompt,
        })

        router.push(`/chat/${new_chat_id}`)

        setUpdate(!update);

        setPrompt("");

        setIsSending(false);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrompt(event.target.value)
    }
    
    return (
        <div className="app-layout">
            <Sidebar activeChatId={+id} />
            <main className="chat-main">
                <div className="messages-scroll-area">
                    {displayMessage(chat)}
                    {isSending && (
                        <div className="typing-row">
                            <div className="message-avatar avatar-ai">E</div>
                            <div className="typing-indicator">
                                <span className="typing-dot" />
                                <span className="typing-dot" />
                                <span className="typing-dot" />
                            </div>
                        </div>
                    )}
                </div>
                <div className="chat-input-bar">
                    <div className="prompt-wrapper" style={{ maxWidth: "720px", width: "100%" }}>
                        <form className="prompt-bar" action={send_chat_continuation}>
                            <input
                                className="prompt-input"
                                type="text"
                                placeholder="Ask Echoes anything..."
                                value={prompt}
                                onChange={handleChange}
                                disabled={isSending}
                            />
                            <button
                                type="submit"
                                className={`prompt-send-btn${isSending ? " btn-loading" : ""}`}
                                disabled={!prompt.trim() || isSending}
                                aria-label="Send"
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}

function displayMessage(data: Chat | ErrorMessage | LoadingMessage) {
    console.log(data.type);

    if (data.type == "chat") {
        console.log(data.messages);

        if (data.messages == null || data.messages.length == 0) {
            return (
                <div className="status-text">
                    <p>No messages yet</p>
                </div>
            )
        }

        return (
            <div className="messages-container">
                {data.messages.map((msg, index) => {
                    const isUser = msg.message_role === 0;
                    return (
                        <div key={msg.id || index} className={`message-row${isUser ? " user-row" : ""}`}>
                            <div className={`message-avatar ${isUser ? "avatar-user" : "avatar-ai"}`}>
                                {isUser ? "U" : "E"}
                            </div>
                            <div className={`message-bubble ${isUser ? "bubble-user" : "bubble-ai"}`}>
                                {msg.contents}
                            </div>
                        </div>
                    );
                })}
            </div>
        )
    } else if (data.type == "error") {
        return <div className="status-text">{data.error}</div>;
    } else {
        return <div className="status-text">{data.message}</div>;
    }
}

interface ChatLookup {
    id: number,
}

async function handle_chat(chatData: ChatLookup) {
    try {
    const response = await fetch('http://echoesapi.bengillitt.xyz:8080/getChat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Tells the backend you are sending JSON
      },
      body: JSON.stringify(chatData), // Converts your JS object to a JSON string,
      credentials: 'include',
    });

    let json = await response.json();

    json.type = "chat";

    // const result = await response.text();
    return json;
  } catch (error) {
    console.error("Error sending data:", error);
    return {error: error as string};
  }
}

interface ContinueChat {
    chat_id: number,
    prompt: string,
    token: string,
}

async function handle_chat_continuation(chatData: ContinueChat) {
    try {
        const response = await fetch('http://echoesapi.bengillitt.xyz:8080/continueChat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Tells the backend you are sending JSON
            },
            body: JSON.stringify(chatData), // Converts your JS object to a JSON string
            credentials: "include",
        })

        return (await response.json()).chat_id;
    } catch (error) {
        console.error("Error sending data:", error);

        return chatData.chat_id;
    }
}