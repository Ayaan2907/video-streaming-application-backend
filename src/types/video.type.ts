import { IComment } from "./comment.type.js";
// import { IUser } from "./user.type.js";
export interface IVideo {
    _id: string;
    title: string;
    description: string;
    authorId: string;
    video: {
        data: Buffer;
        contentType: string;
        // TODO: jugad to store it in chunks
    };

    likes: number;
    dislikes: number;
    comments: IComment[];

    // author: IUser;
    // thumbnail: {
    //     data: Buffer;
    //     contentType: string;
    // };
}
