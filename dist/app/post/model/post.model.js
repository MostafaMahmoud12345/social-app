"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 300,
    },
    userId: {
        type: mongoose_1.Types.ObjectId,
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
}, { timestamps: true });
exports.Post = (0, mongoose_1.model)("Post", schema);
