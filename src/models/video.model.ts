import { Document, Schema, model, Types } from "mongoose";
import { IVideo } from "../types/video.type.js";

const VideoSchema: Schema = new Schema<IVideo>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        author: { type: Types.ObjectId, ref: "Users" },
        video: { data: Buffer, contentType: String }, // TODO: jugad to store it in chunks

        // thumbnail: { data: Buffer, contentType: String },
        comments: [{ type: Types.ObjectId, ref: "Comments" }],
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

// const bucket = new mongo.GridFSBucket(connection.db, {
//     bucketName: "uploads",
// });

export default model<IVideo & Document>("Videos", VideoSchema);
