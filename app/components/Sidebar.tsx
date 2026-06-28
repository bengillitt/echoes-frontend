"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface ChatSummary {
  id: number;
  title?: string;
}

interface SidebarProps {
  activeChatId?: number;
}

export default function Sidebar({ activeChatId }: SidebarProps) {
  const [chats, setChats] = useState<ChatSummary[]>([]);

  useEffect(() => {
    async function loadChats() {
      const data = await getUserChats();
      if (data.type === "ok") {
        // Accept either a top-level array or { chats: [...] }
        const list = Array.isArray(data) ? data : Array.isArray(data.chats) ? data.chats : [];
        setChats(list);
      }
    }
    loadChats();
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Echoes</div>

      <Link href="/" className="sidebar-new-chat-btn">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
        New chat
      </Link>

      {chats.length > 0 && (
        <>
          <div className="sidebar-section-label">Your Chats</div>
          {chats.map((chat) => (
            <Link
              key={chat.id}
              href={`/chat/${chat.id}`}
              className="sidebar-chat-item"
              style={activeChatId === chat.id ? { background: "var(--bg-hover)", color: "var(--text-primary)" } : {}}
            >
              {chat.title == "" ? `Chat ${chat.id}` : chat.title}
            </Link>
          ))}
        </>
      )}
    </aside>
  );
}

async function getUserChats() {
  try {
    const response = await fetch("http://echoesapi.bengillitt.xyz/getUserChats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      data.type = "ok";
    } else {
      data.type = "error";
    }

    return data;
  } catch (error) {
    return { error: error as string, type: "error" };
  }
}
