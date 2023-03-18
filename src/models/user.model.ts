import { IUser, Role } from "../types/user.type";
import { Document, Schema, model } from "mongoose";

const userSchema: Schema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
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

export default model<IUser & Document>("Users", userSchema);
