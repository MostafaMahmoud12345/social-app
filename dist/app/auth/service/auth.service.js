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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("../../../lib/error/error");
const init_1 = require("./../../../lib/email/init");
const user_repository_1 = require("../../user/repository/user.repository");
const otp_1 = require("../../../lib/utils/otp");
const errors_1 = require("../../user/errors");
const errors_2 = require("../errors");
const utils_1 = require("../utils");
const init_2 = require("../../../lib/cache/init");
const time_1 = require("../../../pkg/utils/time");
const google_auth_1 = require("../../../lib/utils/google.auth");
const enum_1 = require("../enum/enum");
const env_1 = require("../../../lib/config/env");
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../lib/di/tokens");
let AuthService = class AuthService {
    userRepository;
    mailProvider;
    twoStepVerificationKey = '2-step-verification:';
    sendOtpKey = 'otp:';
    constructor(userRepository, mailProvider) {
        this.userRepository = userRepository;
        this.mailProvider = mailProvider;
        this.mailProvider = init_1.nodeMailerProvider;
    }
    register = async (registerDto) => {
        const userExist = await this.userRepository.findByEmail(registerDto.email);
        if (userExist)
            throw errors_1.userAlreadyExist;
        registerDto.password = await (0, utils_1.hashPassword)(registerDto.password);
        const createdUser = await this.userRepository.create(registerDto);
        const code = (0, otp_1.generateOTPCode)();
        await init_2.cacheProvider.set(`${this.sendOtpKey}${createdUser._id.toString()}`, code, (0, time_1.toSeconds)(3, 'minutes'));
        await this.mailProvider.send(registerDto.email, 'verification code', `<h1>Your verification code is ${code} </h1>`);
        return createdUser;
    };
    verifyAccount = async (verifayAcountDto) => {
        const user = await this.userRepository.findByEmail(verifayAcountDto.email);
        if (!user)
            throw errors_1.userNotExist;
        if (user['isVerified'] === true)
            throw errors_1.userAlreadyVerified;
        const cacheCode = await init_2.cacheProvider.get(`${this.sendOtpKey}${user._id.toString()}`);
        if (!cacheCode)
            throw errors_2.otpExpired;
        if (cacheCode !== verifayAcountDto.code)
            throw errors_2.invalidCode;
        const updatedUser = await this.userRepository.update({ email: verifayAcountDto.email }, { isVerified: true });
        await init_2.cacheProvider.del(`${this.sendOtpKey}${user._id.toString()}`);
        return updatedUser;
    };
    enable2StepVerification = async (enable2StepVerificationDto) => {
        const code = (0, otp_1.generateOTPCode)();
        await init_2.cacheProvider.set(`${this.twoStepVerificationKey}${enable2StepVerificationDto.email}`, code, (0, time_1.toSeconds)(3, 'minutes'));
        await this.mailProvider.send(enable2StepVerificationDto.email, '2 step verification code', `your 2 step verification code is ${code}`);
    };
    verifyCodeActiveTwoStepVerification = async (verifyCodeActiveTwoStepVerificationDto) => {
        const user = await this.userRepository.findByEmail(verifyCodeActiveTwoStepVerificationDto.email); // {} | null
        if (!user)
            throw errors_1.userNotExist;
        console.log(`${this.twoStepVerificationKey}${verifyCodeActiveTwoStepVerificationDto.email}`);
        const cacheCode = await init_2.cacheProvider.get(`${this.twoStepVerificationKey}${verifyCodeActiveTwoStepVerificationDto.email}`);
        console.log(cacheCode);
        if (!cacheCode)
            throw errors_2.otpExpired;
        if (cacheCode !== verifyCodeActiveTwoStepVerificationDto.code)
            throw errors_2.invalidCode;
        await this.userRepository.update({ email: verifyCodeActiveTwoStepVerificationDto.email }, { twoStepVerification: true });
        await init_2.cacheProvider.del(`${this.twoStepVerificationKey}${verifyCodeActiveTwoStepVerificationDto.email}`);
    };
    login = async (loginDto) => {
        const cachedAttempt = await init_2.cacheProvider.get(`${loginDto.email}:login`);
        if (cachedAttempt === '0')
            throw new error_1.AppError('you reach max tries', 429);
        const user = await this.userRepository.findByEmail(loginDto.email);
        if (!user)
            throw errors_1.userNotExist;
        if (user['isVerified'] === false)
            throw errors_1.userNotVerified;
        const match = await (0, utils_1.comparePassword)(loginDto.password, user['password']);
        if (!match)
            throw errors_2.invalidPassword;
        if (user.twoStepVerification == true) {
            const code = (0, otp_1.generateOTPCode)();
            await init_2.cacheProvider.set(`${this.twoStepVerificationKey}${loginDto.email}`, code, (0, time_1.toSeconds)(1, 'minutes'));
            await this.mailProvider.send(loginDto.email, '2 step verification code', `<h3>your code is ${code}</h3>`);
            return;
        }
        const accessToken = (0, utils_1.generateAccessToken)({ id: user._id, name: user.userName });
        const refreshToken = (0, utils_1.generateRefreshToken)({ id: user._id, name: user.userName });
        const ttlRemaining = await init_2.cacheProvider.ttl(`${loginDto.email}:login`);
        const attempts = cachedAttempt ?? 5;
        const ttl = ttlRemaining === -2 ? (0, time_1.toSeconds)(3, 'minutes') : ttlRemaining;
        await init_2.cacheProvider.set(`${loginDto.email}:login`, String(+attempts - 1), ttl);
        return {
            accessToken, refreshToken
        };
    };
    vverifyCodeTwoStepVerification = async (verifyCodeTwoStepVerificationDto) => {
        const user = await this.userRepository.findByEmail(verifyCodeTwoStepVerificationDto.email);
        if (!user)
            throw errors_1.userNotExist;
        const cacheCode = await init_2.cacheProvider.get(`${this.twoStepVerificationKey}${verifyCodeTwoStepVerificationDto.email}`);
        if (!cacheCode)
            throw errors_2.otpExpired;
        if (cacheCode !== verifyCodeTwoStepVerificationDto.code)
            throw errors_2.invalidCode;
        const accessToken = (0, utils_1.generateAccessToken)({ id: user._id, name: user.userName });
        const refreshToken = (0, utils_1.generateRefreshToken)({ id: user._id, name: user.userName });
        await init_2.cacheProvider.del(`${this.twoStepVerificationKey}${verifyCodeTwoStepVerificationDto.email}`);
        return { accessToken, refreshToken };
    };
    sendOtp = async (sendOtpDto) => {
        const user = await this.userRepository.findByEmail(sendOtpDto.email);
        if (!user)
            throw errors_1.userNotExist;
        const code = (0, otp_1.generateOTPCode)();
        await init_2.cacheProvider.set(`${this.sendOtpKey}${user._id.toString()}`, code, (0, time_1.toSeconds)(3, 'minutes'));
        await this.mailProvider.send(sendOtpDto.email, 'new otp', `<p>your new otp is ${code}</p>`);
    };
    resetPassword = async (resetPasswordDto) => {
        const user = await this.userRepository.findByEmail(resetPasswordDto.email);
        if (!user)
            throw errors_1.userNotExist;
        const otp = await init_2.cacheProvider.get(`${this.sendOtpKey}${user._id.toString()}`);
        if (!otp)
            throw errors_2.otpExpired;
        if (otp !== resetPasswordDto.code)
            throw errors_2.invalidCode;
        const hashedPassword = await (0, utils_1.hashPassword)(resetPasswordDto.newPassword);
        await this.userRepository.update({ email: resetPasswordDto.email }, { password: hashedPassword });
        await init_2.cacheProvider.del(`${this.sendOtpKey}${user._id.toString()}`);
    };
    loginWithCGoogle = async (idToken) => {
        const payload = await (0, google_auth_1.verifyGoogleToken)(idToken);
        if (!payload)
            throw new error_1.AppError('Invalid Google token', 400);
        const user = await this.userRepository.findByEmail(payload.email);
        if (user) {
            return (0, utils_1.generateAccessToken)({
                id: user._id,
                email: user.email,
            });
        }
        const createdUser = await this.userRepository.create({
            userName: payload.name,
            email: payload.email,
            provider: enum_1.Provider.google,
            isVerified: true,
        });
        return (0, utils_1.generateAccessToken)({
            id: createdUser._id,
            email: createdUser.email,
        });
    };
    refreshTokenFn = async (token) => {
        const isRevoked = await init_2.cacheProvider.get(`revoked:${token}`);
        if (isRevoked)
            throw new error_1.AppError('Token has been revoked', 401);
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.jwt.refreshSecret);
        await init_2.cacheProvider.set(`revoked:${token}`, '1', (0, time_1.toSeconds)(7, 'days'));
        const userId = payload.id || payload.sub;
        const userName = payload.name || payload.userName;
        const accessToken = (0, utils_1.generateAccessToken)({ id: userId, name: userName });
        const refreshToken = (0, utils_1.generateRefreshToken)({ id: userId, name: userName });
        return {
            accessToken, refreshToken
        };
    };
    revokeToken = async (token) => {
        jsonwebtoken_1.default.verify(token, env_1.env.jwt.refreshSecret);
        await init_2.cacheProvider.set(`revoked:${token}`, '1', (0, time_1.toSeconds)(7, 'days'));
    };
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.UserRepository)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.TOKENS.NodeMailerProvider)),
    __metadata("design:paramtypes", [user_repository_1.UserRepository, Object])
], AuthService);
