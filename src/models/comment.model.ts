import { Document, Schema, Types, model } from "mongoose";
import { IComment, IReply } from "../types/comment.type.js";
import { CollectionNames } from "../types/collection.types.js"

// const ReplySchema: Schema = new Schema<IReply>(
//     {
//         commentId: { type: String, required: true },
//         authorId: { type: String, required: true },
//         reply: { type: String, required: true },
//         likes: { type: Number, default: 0 },
//         dislikes: { type: Number, default: 0 },
//     },
//     {
//         versionKey: false,
//         timestamps: true,
//         toJSON: { virtuals: true },
//         toObject: { virtuals: true },
//     }
// );

const CommentSchema: Schema = new Schema<IComment>(
    {
        video: { type: Types.ObjectId, ref: "Videos", required: true },
        author: { type: String, required: true },
        comment: { type: String, required: true },
        // replies: { type: [String], default: [] },
        likes: { type: Number, default: 0 },
        dislikes: { type: Number, default: 0 },
    },
    {
        versionKey: false,
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const Comment = model<IComment & Document>(CollectionNames.Comment, CommentSchema);
// const Reply = model<IReply & Document>("Replies", ReplySchema);

export default {
    Comment,
    // Reply,
};
