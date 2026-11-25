"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = require("express");
const container_1 = __importDefault(require("../../lib/di/container"));
const tokens_1 = require("../../lib/di/tokens");
const authGuard_1 = require("../../lib/auth/authGuard");
const commentController = container_1.default.resolve(tokens_1.TOKENS.CommentController);
exports.commentRouter = (0, express_1.Router)();
exports.commentRouter.use(authGuard_1.authGuard);
exports.commentRouter.get("/:commentId", commentController.getSingleComment);
exports.commentRouter.patch("/:commentId", commentController.updateComment);
exports.commentRouter.delete("/:commentId", commentController.deleteComment);
