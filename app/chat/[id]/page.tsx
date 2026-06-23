'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
    const [chat, setChat] = useState<Chat | ErrorMessage | LoadingMessage>({type: "loading", message: "Fetching Chat..."});
    const [prompt, setPrompt] = useState<string>("");

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

        let new_chat_id = await handle_chat_continuation({
            chat_id: +id,
            token: token as string,
            prompt: prompt,
        })

        router.push(`/chat/${new_chat_id}`)

        setUpdate(!update);

        setPrompt("");
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrompt(event.target.value);
    }
    
    return (
        <div>
            {displayMessage(chat)}
            <form action={send_chat_continuation}>
                <input type="text" placeholder="Ask Echoes anything..." value={prompt} onChange={handleChange}></input>
                <input type="submit" value="Send"></input>
            </form>
        </div>
    )
}

function displayMessage(data: Chat | ErrorMessage | LoadingMessage) {
    console.log(data.type);

    if (data.type == "chat") {
        console.log(data.messages);

        if (data.messages == null || data.messages.length == 0) {
            return (
                <div>
                    <p>No Messages Found</p>
                </div>
            )
        }

        return (
            <div>
            <ul>
                {data.messages.map((msg, index) => (<li key={msg.id || index}>
                    {msg.contents}
                </li>))}
            </ul>
            </div>
        )
    } else if (data.type == "error") {
        return data.error;
    } else {
        return data.message;
    }
}

interface ChatLookup {
    id: number,
}

async function handle_chat(chatData: ChatLookup) {
    try {
    const response = await fetch('http://localhost:8080/getChat', {
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
        const response = await fetch('http://localhost:8080/continueChat', {
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