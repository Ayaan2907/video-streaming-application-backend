import { IComment } from "./comment.type.js";
// import { IUser } from "./user.type.js";
import { Document } from "mongoose";
export interface IVideo {
    _id: string;
    title: string;
    description: string;
    author: Document;
    video: {
        data: Buffer;
        contentType: string;
        // TODO: jugad to store it in chunks
    };

    likes: number;
    dislikes: number;
    comments: IComment[] | Document[];

    // thumbnail: {
    //     data: Buffer;
    //     contentType: string;
    // };
}
