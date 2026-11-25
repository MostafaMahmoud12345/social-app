import { HydratedDocument, model, Schema, Types } from "mongoose";
import { IPost } from "../interface/post.interface";

export type PostDocument = HydratedDocument<IPost>;

const schema = new Schema<IPost>(
    {
        content: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 300,
        },
        userId: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        commentCount: {
            type: Number,
            default: 0,
        },
        reactionCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export const Post = model<IPost>("Post", schema);
