import { useRef, useState } from "react";
import { Search } from "lucide-react";
import type { Chat } from "./types";

interface SidebarProps {
    chats: Chat[];
    activeId: number;
    onSelect: (id: number) => void;
    profilePic: string | null;
    onPicSelect: (file: File) => void;
}

export default function Sidebar({ chats, activeId, onSelect, profilePic, onPicSelect }: SidebarProps) {
    const [search, setSearch] = useState("");
    const picInputRef = useRef<HTMLInputElement>(null);

    const filteredChats = chats.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div
                    className="avatar clickable"
                    title="Change profile picture"
                    onClick={() => picInputRef.current?.click()}
                >
                    {profilePic ? <img src={profilePic} alt="profile" /> : "You"}
                </div>
                <input
                    type="file"
                    accept="image/*"
                    ref={picInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onPicSelect(file);
                        e.target.value = "";
                    }}
                />
                <div>
                    <div className="header-name">My Space</div>
                    <div className="header-status">Available</div>
                </div>
            </div>

            <div className="search-box">
                <Search size={16} />
                <input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="chat-list">
                {filteredChats.length === 0 && (
                    <div className="no-results">No chats found</div>
                )}
                {filteredChats.map((chat) => (
                    <div
                        key={chat.id}
                        className={`chat-item ${activeId === chat.id ? "active" : ""}`}
                        onClick={() => onSelect(chat.id)}
                    >
                        <div className="avatar small">{chat.name[0]}</div>
                        <div className="chat-item-text">
                            <div className="chat-item-top">
                                <span className="chat-item-name">{chat.name}</span>
                                <span className="chat-item-time">{chat.time}</span>
                            </div>
                            <div className="chat-item-preview">{chat.preview}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
