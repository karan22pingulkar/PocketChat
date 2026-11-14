import { useEffect, useRef, useState } from "react";
import { Paperclip, Send, Smile } from "lucide-react";
import type { Message } from "./types";
import Sidebar from "./Sidebar";
import "./chat.css";

const mockMessages: Message[] = [
    { id: 1, text: "Hey! This is my private space.", createdAt: "10:14 AM", isMine: true },
    { id: 2, text: "I can save notes, links and files here.", createdAt: "10:15 AM", isMine: true },
    { id: 3, text: "It will sync across my devices once the backend is ready.", createdAt: "10:16 AM", isMine: true },
];

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [text, setText] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);

    const emojis = ["😀", "😂", "😍", "👍", "🔥", "🎉", "😭", "🙏"];
    const bottomRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // scroll to bottom whenever a new message is added
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    function sendMessage() {
        if (text.trim() === "") return;

        const newMessage: Message = {
            id: Date.now(),
            text: text,
            createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isMine: true,
        };

        setMessages([...messages, newMessage]);
        setText("");
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            sendMessage();
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const newMessage: Message = {
            id: Date.now(),
            text: "",
            createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isMine: true,
            attachment: { id: Date.now(), fileName: file.name },
        };

        setMessages([...messages, newMessage]);
        e.target.value = ""; // reset so picking the same file twice still works
    }

    return (
        <div className="page">
            <Sidebar />
            <div className="chat-window">
                {/* header */}
                <div className="chat-header">
                    <div className="avatar">You</div>
                    <div>
                        <div className="header-name">My Notes</div>
                        <div className="header-status">Only visible to you</div>
                    </div>
                </div>

                {/* messages */}
                <div className="messages">
                    <div className="date-divider"><span>Today</span></div>

                    {messages.map((msg) => (
                        <div key={msg.id} className={`msg-row ${msg.isMine ? "mine" : ""}`}>
                            <div className="bubble">
                                {msg.attachment ? (
                                    <div className="attachment">📎 {msg.attachment.fileName}</div>
                                ) : (
                                    msg.text
                                )}
                                <div className="msg-time">{msg.createdAt}</div>
                            </div>
                        </div>
                    ))}

                    <div ref={bottomRef} />
                </div>

                {/* composer */}
                <div className="composer">
                    <button className="icon-btn" onClick={() => setShowEmoji(!showEmoji)}>
                        <Smile size={20} />
                    </button>

                    {showEmoji && (
                        <div className="emoji-pop">
                            {emojis.map((e) => (
                                <button key={e} onClick={() => setText(text + e)}>
                                    {e}
                                </button>
                            ))}
                        </div>
                    )}

                    <button className="icon-btn" onClick={() => fileInputRef.current?.click()}>
                        <Paperclip size={20} />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                    <input
                        className="composer-input"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button className="send-btn" onClick={sendMessage}>
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}