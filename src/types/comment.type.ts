import { Document } from 'mongoose';
export interface IReply {
    _id: string;
    comment: Document;
    author: Document;
    reply: string;
    likes: number;
    dislikes: number;
}

export interface IComment {
    _id: string;
    video: Document;
    author: Document;
    comment: string;
    // replies?: IReply[];
    likes: number;
    dislikes: number;
}
