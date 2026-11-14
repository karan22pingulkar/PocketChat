export interface Attachment {
    id: number;
    fileName: string;
}

export interface Message {
    id: number;
    text: string;
    createdAt: string;
    isMine: boolean;
    attachment?: Attachment;
}