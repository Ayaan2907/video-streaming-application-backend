import { Document, Schema, model, Types } from "mongoose";
import { IVideo } from "../types/video.type.js";
import { CollectionNames } from "../types/collection.types.js";

const AWS_S3_URL = "https://video-streaming-application.s3.amazonaws.com"; //sample

const VideoSchema: Schema = new Schema<IVideo>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        author: { type: Types.ObjectId, ref: "Users" },
        videoUrl: {
            type: String,
            // required: true,
        },

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

// VideoSchema.set("toJSON", {
//     virtuals: true,
//     transform: function (doc, ret) {
//         delete ret._id;
//         delete ret.__v;
//     },
// });

VideoSchema.pre("save", function (next) {
    const videoObjectID = this._id;
    this.videoUrl = ` ${AWS_S3_URL}/${videoObjectID}`;
    next();
});

export default model<IVideo & Document>(CollectionNames.Video, VideoSchema);
