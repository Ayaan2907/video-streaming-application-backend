import { Document, Schema, model, Types } from "mongoose";
import { IVideo } from "../types/video.type.js";
import CommentSchema from "./comment.model.js";

const VideoSchema: Schema = new Schema<IVideo>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        authorId: { type: String, required: true },
        video: { data: Buffer, contentType: String },
        // thumbnail: { data: Buffer, contentType: String },
        // TODO: jugad to store it in chunks
        comments: { type: [CommentSchema], default: [] },
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

const Video = model<IVideo & Document>("Videos", VideoSchema);

export default {
    Video,
    VideoSchema,
};
