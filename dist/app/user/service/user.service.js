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
exports.UserService = void 0;
const user_repository_1 = require("./../repository/user.repository");
const node_fs_1 = __importDefault(require("node:fs"));
const error_1 = require("../../../lib/error/error");
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../lib/di/tokens");
let UserService = class UserService {
    userRepository;
    cloudProvider;
    constructor(userRepository, cloudProvider) {
        this.userRepository = userRepository;
        this.cloudProvider = cloudProvider;
    }
    uploadProfilePicture = async (file, userId) => {
        file.buffer = node_fs_1.default.readFileSync(file.path);
        const key = await this.cloudProvider.uploudFile(file, `users/${userId}`);
        await this.userRepository.update({ _id: userId }, { profilePicturePath: key });
    };
    generatePresigneUrl = async (file, userId) => {
        return await this.cloudProvider.generatePresigneUrl(file, `users/${userId}`);
    };
    deletProfilePicture = async (userId) => {
        const user = await this.userRepository.getOne({ _id: userId });
        if (!user?.profilePicturePath) {
            throw new error_1.AppError('profile picture not found', 404);
        }
        await this.cloudProvider.deleteFile(user.profilePicturePath);
        await this.userRepository.update({ _id: userId }, { $unset: { profilePicturePath: '' } });
    };
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.UserRepository)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.TOKENS.CloudProvider)),
    __metadata("design:paramtypes", [user_repository_1.UserRepository, Object])
], UserService);
