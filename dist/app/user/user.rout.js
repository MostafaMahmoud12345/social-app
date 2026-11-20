"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = __importDefault(require("./controller/user.controller"));
const multer_1 = require("../../lib/media/multer");
const authGuard_1 = require("../../lib/auth/authGuard");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.post('/upload-profile-picture', authGuard_1.authGuard, (0, multer_1.uploadSingle)('pp'), user_controller_1.default.uploadProfilePicture);
exports.userRouter.delete('/delete-profile-picture', user_controller_1.default.deletProfilePicture);
