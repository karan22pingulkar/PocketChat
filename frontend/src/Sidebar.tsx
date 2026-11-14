import { useState } from "react";
import { Search } from "lucide-react";

// placeholder chats - later these can become real categories
const chats = [
    { id: 1, name: "My Notes", preview: "Your private space", time: "10:16 AM" },
    { id: 2, name: "Links", preview: "Save links to read later", time: "" },
    { id: 3, name: "Files", preview: "Documents and images", time: "" },
];

export default function Sidebar() {
    const [active, setActive] = useState(1);

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="avatar">You</div>
                <div>
                    <div className="header-name">My Space</div>
                    <div className="header-status">Available</div>
                </div>
            </div>

            <div className="search-box">
                <Search size={16} />
                <input placeholder="Search..." />
            </div>

            <div className="chat-list">
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        className={`chat-item ${active === chat.id ? "active" : ""}`}
                        onClick={() => setActive(chat.id)}
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
