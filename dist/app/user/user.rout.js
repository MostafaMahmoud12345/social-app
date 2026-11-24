"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const container_1 = __importDefault(require("../../lib/di/container"));
const express_1 = require("express");
const multer_1 = require("../../lib/media/multer");
const tokens_1 = require("../../lib/di/tokens");
const userController = container_1.default.resolve(tokens_1.TOKENS.UserController);
exports.userRouter = (0, express_1.Router)();
exports.userRouter.post('/upload-profile-picture', (0, multer_1.uploadSingle)('pp'), userController.uploadProfilePicture);
exports.userRouter.post('/generate-presigne-url', userController.generatePresigneUrl);
exports.userRouter.delete('/delete-profile-picture', userController.deletProfilePicture);
