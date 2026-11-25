"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notPostOwner = exports.postNotFound = void 0;
const error_1 = require("../../lib/error/error");
exports.postNotFound = new error_1.AppError("Post not found", 404);
exports.notPostOwner = new error_1.AppError("You are not allowed to perform this action", 403);
