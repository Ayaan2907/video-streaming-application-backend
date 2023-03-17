export interface IReply {
    _id: string;
    commentId: string;
    authorId: string;
    reply: string;
    likes: number;
    dislikes: number;
}

export interface IComment {
    _id: string;
    videoId: string;
    authorId: string;
    comment: string;
    // replies?: IReply[];
    likes: number;
    dislikes: number;
}
