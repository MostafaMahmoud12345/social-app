"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./controller/auth.controller"));
const authRouter = (0, express_1.Router)();
authRouter.post('/register', auth_controller_1.default.register);
authRouter.post('/verify-account', auth_controller_1.default.verifyAccount);
authRouter.post('/login', auth_controller_1.default.login);
authRouter.post('/verify-2step', auth_controller_1.default.verifyCodeTwoStepVerification);
authRouter.post('/enable-2step', auth_controller_1.default.enable2StepVerification);
authRouter.post('/verify-active-2step', auth_controller_1.default.verifyCodeActiveTwoStepVerification);
authRouter.post('/send-otp', auth_controller_1.default.sendOtp);
authRouter.post('/reset-password', auth_controller_1.default.resetPassword);
authRouter.post('/google', auth_controller_1.default.loginWithGoogle);
authRouter.post('/refresh-token', auth_controller_1.default.refreshToken);
exports.default = authRouter;
