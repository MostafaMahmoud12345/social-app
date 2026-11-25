"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../service/auth.service");
const utils_1 = require("../utils");
const error_1 = require("../../../lib/error/error");
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../lib/di/tokens");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register = async (req, res, next) => {
        try {
            const user = await this.authService.register(req.body);
            res.status(201).json({ message: 'User created successfully', success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    };
    verifyAccount = async (req, res, next) => {
        try {
            const user = await this.authService.verifyAccount(req.body);
            res.status(200).json({ message: 'Account verified successfully', success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const result = await this.authService.login(req.body);
            if (!result) {
                return res.status(200).json({
                    message: 'Two-step verification code sent to your email',
                    success: true
                });
            }
            (0, utils_1.setCookies)(res, result.accessToken, result.refreshToken);
            res.status(200).json({
                message: 'Logged in successfully',
                success: true,
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    };
    verifyCodeTwoStepVerification = async (req, res, next) => {
        try {
            const result = await this.authService.vverifyCodeTwoStepVerification(req.body);
            (0, utils_1.setCookies)(res, result.accessToken, result.refreshToken);
            res.status(200).json({
                message: 'Two-step verification verified successfully',
                success: true,
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    };
    enable2StepVerification = async (req, res, next) => {
        try {
            await this.authService.enable2StepVerification(req.body);
            res.status(200).json({
                message: 'Two-step verification code sent to your email',
                success: true
            });
        }
        catch (error) {
            next(error);
        }
    };
    verifyCodeActiveTwoStepVerification = async (req, res, next) => {
        try {
            await this.authService.verifyCodeActiveTwoStepVerification(req.body);
            res.status(200).json({
                message: 'Two-step verification activated successfully',
                success: true
            });
        }
        catch (error) {
            next(error);
        }
    };
    sendOtp = async (req, res, next) => {
        try {
            await this.authService.sendOtp(req.body);
            res.status(200).json({
                message: 'OTP sent successfully',
                success: true
            });
        }
        catch (error) {
            next(error);
        }
    };
    resetPassword = async (req, res, next) => {
        try {
            await this.authService.resetPassword(req.body);
            res.status(200).json({
                message: 'Password reset successfully',
                success: true
            });
        }
        catch (error) {
            next(error);
        }
    };
    loginWithGoogle = async (req, res, next) => {
        try {
            const idToken = req.body.idToken || req.body.token;
            if (!idToken) {
                throw new error_1.AppError('Google ID token is required', 400);
            }
            const accessToken = await this.authService.loginWithCGoogle(idToken);
            res.status(200).json({
                message: 'Logged in with Google successfully',
                success: true,
                data: { accessToken }
            });
        }
        catch (error) {
            next(error);
        }
    };
    refreshToken = async (req, res, next) => {
        try {
            const token = req.cookies?.refresh_token || req.body?.refreshToken || req.body?.token;
            if (!token) {
                throw new error_1.AppError('Refresh token is required', 400);
            }
            const result = await this.authService.refreshTokenFn(token);
            (0, utils_1.setCookies)(res, result.accessToken, result.refreshToken);
            res.status(200).json({
                message: 'Token refreshed successfully',
                success: true,
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    };
    logout = async (req, res, next) => {
        try {
            const token = req.cookies?.refresh_token || req.body?.refreshToken || req.body?.token;
            if (token) {
                await this.authService.revokeToken(token);
            }
            res.clearCookie('access_token');
            res.clearCookie('refresh_token', { path: '/api/auth/refresh-token' });
            res.status(200).json({
                message: 'Logged out and token revoked successfully',
                success: true
            });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.AuthService)),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
