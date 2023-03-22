import { IUser, Role } from "../types/user.type.js";
import { Document, Schema, model } from "mongoose";
import { CollectionNames } from "../types/collection.types.js"

const userSchema: Schema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        // other: [
        //     {
        //         name: "uploadedVideos",
        //         type: Schema.Types.ObjectId,
        //         ref: "Videos",
        //     },
        //     {
        //         name: "postedComments",
        //         type: Schema.Types.ObjectId,
        //         ref: "Comments",
        //     }
        // ], Later 

        role: {
            type: String,
            required: true,
            enum: Role,
            default: Role.STUDENT,
        },
    },
    {
        versionKey: false,
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export default model<IUser & Document>(CollectionNames.User, userSchema);
