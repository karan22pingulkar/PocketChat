import { useEffect, useRef, useState } from "react";
import { Check, CheckCheck, Paperclip, Send, Smile } from "lucide-react";
import type { Chat, Message } from "./types";
import Sidebar from "./Sidebar";
import "./chat.css";

const chats: Chat[] = [
    { id: 1, name: "Saved Messages", preview: "Your private space", time: "", color: "#8a7ff0" },
    { id: 2, name: "Links", preview: "Save links to read later", time: "", color: "#5bbfa8" },
    { id: 3, name: "Files", preview: "Documents and images", time: "", color: "#f0a06e" },
];

const mockMessages: Message[] = [
    { id: 1, text: "Hey! This is my private space.", createdAt: "10:14 AM", isMine: true, status: "seen" },
    { id: 2, text: "I can save notes, links and files here.", createdAt: "10:15 AM", isMine: true, status: "seen" },
    { id: 3, text: "It will sync across my devices once the backend is ready.", createdAt: "10:16 AM", isMine: true, status: "seen" },
];

export default function ChatPage() {
    const [activeChat, setActiveChat] = useState(1);
    const [messagesByChat, setMessagesByChat] = useState<Record<number, Message[]>>({
        1: mockMessages,
        2: [],
        3: [],
    });
    const [text, setText] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const [profilePic, setProfilePic] = useState<string | null>(() => localStorage.getItem("profilePic"));

    const bottomRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const emojis = ["😀", "😂", "😍", "👍", "🔥", "🎉", "😭", "🙏"];

    const messages = messagesByChat[activeChat] ?? [];
    const activeChatData = chats.find((c) => c.id === activeChat);

    // sidebar preview + time show the latest message of each chat
    const sidebarChats = chats.map((c) => {
        const lastMsg = (messagesByChat[c.id] ?? []).slice(-1)[0];
        return {
            ...c,
            preview: lastMsg
                ? lastMsg.attachment
                    ? "📎 " + lastMsg.attachment.fileName
                    : lastMsg.text
                : c.preview,
            time: lastMsg ? lastMsg.createdAt : c.time,
        };
    });

    // scroll to bottom whenever a new message is added
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    function updateStatus(messageId: number, status: Message["status"]) {
        setMessagesByChat((prev) => ({
            ...prev,
            [activeChat]: (prev[activeChat] ?? []).map((m) =>
                m.id === messageId ? { ...m, status } : m
            ),
        }));
    }

    function addMessage(newMessage: Message) {
        setMessagesByChat((prev) => ({
            ...prev,
            [activeChat]: [...(prev[activeChat] ?? []), newMessage],
        }));

        // whatsapp style: sent -> delivered -> seen
        setTimeout(() => updateStatus(newMessage.id, "delivered"), 700);
        setTimeout(() => updateStatus(newMessage.id, "seen"), 1600);
    }

    function sendMessage() {
        if (text.trim() === "") return;

        addMessage({
            id: Date.now(),
            text: text,
            createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isMine: true,
            status: "sent",
        });

        setText("");
        setShowEmoji(false);
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            sendMessage();
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        addMessage({
            id: Date.now(),
            text: "",
            createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isMine: true,
            status: "sent",
            attachment: {
                id: Date.now(),
                fileName: file.name,
                fileUrl: URL.createObjectURL(file),
                fileType: file.type,
            },
        });

        e.target.value = ""; // reset so picking the same file twice still works
    }

    function handlePicSelect(file: File) {
        const reader = new FileReader();
        reader.onload = () => {
            const pic = reader.result as string;
            setProfilePic(pic);
            localStorage.setItem("profilePic", pic);
        };
        reader.readAsDataURL(file);
    }

    return (
        <div className="page">
            <Sidebar
                chats={sidebarChats}
                activeId={activeChat}
                onSelect={setActiveChat}
                profilePic={profilePic}
                onPicSelect={handlePicSelect}
            />

            <div className="chat-window">
                {/* header */}
                <div className="chat-header">
                    <div className="avatar">
                        {profilePic ? <img src={profilePic} alt="profile" /> : activeChatData?.name[0]}
                    </div>
                    <div>
                        <div className="header-name">{activeChatData?.name}</div>
                        <div className="header-status">Only visible to you</div>
                    </div>
                </div>

                {/* messages */}
                <div className="messages">
                    <div className="date-divider"><span>Today</span></div>

                    {messages.length === 0 && (
                        <div className="empty-chat">No messages yet. Say hi to yourself!</div>
                    )}

                    {messages.map((msg) => (
                        <div key={msg.id} className={`msg-row ${msg.isMine ? "mine" : ""}`}>
                            <div className="bubble">
                                {msg.attachment ? (
                                    msg.attachment.fileType.startsWith("image/") ? (
                                        <a href={msg.attachment.fileUrl} target="_blank" rel="noreferrer">
                                            <img
                                                className="msg-image"
                                                src={msg.attachment.fileUrl}
                                                alt={msg.attachment.fileName}
                                            />
                                        </a>
                                    ) : (
                                        <a
                                            className="attachment"
                                            href={msg.attachment.fileUrl}
                                            download={msg.attachment.fileName}
                                        >
                                            📎 {msg.attachment.fileName}
                                        </a>
                                    )
                                ) : (
                                    msg.text
                                )}
                                <div className="msg-time">
                                    {msg.createdAt}
                                    {msg.isMine &&
                                        (msg.status === "sent" ? (
                                            <Check size={13} className="tick" />
                                        ) : (
                                            <CheckCheck
                                                size={13}
                                                className={`tick ${msg.status === "seen" ? "seen" : ""}`}
                                            />
                                        ))}
                                </div>
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
