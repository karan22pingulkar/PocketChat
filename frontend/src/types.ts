export interface Attachment {
    id: number;
    fileName: string;
    fileUrl: string;
    fileType: string;
}

export interface Message {
    id: number;
    text: string;
    createdAt: string;
    isMine: boolean;
    attachment?: Attachment;
}

export interface Chat {
    id: number;
    name: string;
    preview: string;
    time: string;
    color: string;
}
