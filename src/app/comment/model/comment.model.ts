import { HydratedDocument, model, Schema, Types } from "mongoose";
import { IComment } from "../interface/comment.interface";

export type CommentDocument = HydratedDocument<IComment>;

const schema = new Schema<IComment>(
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
        postId: {
            type: Types.ObjectId,
            ref: "Post",
            required: true,
        },
    },
    { timestamps: true }
);

export const Comment = model<IComment>("Comment", schema);
