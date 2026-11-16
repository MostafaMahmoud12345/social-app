import { model, Schema, Types } from "mongoose";
const schema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 300
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        requird: true
    },
    commentCount: {
        type: Number,
        default: 0
    },
    reactionCount: {
        type: Number,
        default: 0
    }
});
export const Post = model('Post', schema);
