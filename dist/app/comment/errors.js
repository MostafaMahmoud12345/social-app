"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notCommentOwner = exports.commentNotFound = void 0;
const error_1 = require("../../lib/error/error");
exports.commentNotFound = new error_1.AppError("Comment not found", 404);
exports.notCommentOwner = new error_1.AppError("You are not allowed to perform this action", 403);
