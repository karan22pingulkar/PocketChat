import { api } from "./client";
import type { Message } from "../types";

export function getMessages() {
    return api<Message[]>("/messages");
}

export function sendMessage(text: string) {
    return api<Message>("/messages", {
        method: "POST",
        body: JSON.stringify({ text }),
    });
}

export function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return api<Message>("/messages/attachments", {
        method: "POST",
        body: formData,
    });
}
