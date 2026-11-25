"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_rout_1 = __importDefault(require("./app/auth/auth.rout"));
const user_rout_1 = require("./app/user/user.rout");
const post_rout_1 = require("./app/post/post.rout");
const comment_rout_1 = require("./app/comment/comment.rout");
exports.router = (0, express_1.Router)();
exports.router.use('/auth', auth_rout_1.default);
exports.router.use('/user', user_rout_1.userRouter);
exports.router.use('/post', post_rout_1.postRouter);
exports.router.use('/comment', comment_rout_1.commentRouter);
