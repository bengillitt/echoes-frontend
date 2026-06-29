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
  const [isOpen, setIsOpen] = useState(false);

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
    <>
      <button className="mobile-menu-btn" onClick={() => setIsOpen(true)} aria-label="Open menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header-row">
          <div className="sidebar-logo" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <img src="/icon.png" alt="Echoes Logo" style={{ width: "24px", height: "24px", borderRadius: "4px" }} />
            Echoes
          </div>
          <button className="mobile-close-btn" onClick={() => setIsOpen(false)} aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <Link href="/" className="sidebar-new-chat-btn" onClick={() => setIsOpen(false)}>
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
                onClick={() => setIsOpen(false)}
              >
                {chat.title == "" ? `Chat ${chat.id}` : chat.title}
              </Link>
            ))}
          </>
        )}
      </aside>
    </>
  );
}

async function getUserChats() {
  try {
    const response = await fetch("https://echoesapi.bengillitt.xyz/getUserChats", {
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
