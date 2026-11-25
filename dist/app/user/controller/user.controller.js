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
exports.UserController = void 0;
const user_service_1 = require("../service/user.service");
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../lib/di/tokens");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    uploadProfilePicture = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            await this.userService.uploadProfilePicture(req.file, userId);
            res.json({ message: "ProfilePicture upload successfully", success: true });
        }
        catch (error) {
            next(error);
        }
    };
    generatePresigneUrl = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const { fileName, contentType } = req.body;
            const url = await this.userService.generatePresigneUrl({ mimetype: contentType, originalname: fileName }, userId);
            res.json({ message: "ok", success: true, data: { url } });
        }
        catch (error) {
            next(error);
        }
    };
    deletProfilePicture = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            await this.userService.deletProfilePicture(userId);
            res.json({ message: "ProfilePicture delete successfully", success: true });
        }
        catch (error) {
            next(error);
        }
    };
    getMyProfile = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const user = await this.userService.getMyProfile(userId);
            res.status(200).json({ message: "Profile retrieved successfully", success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    };
    getUserProfile = async (req, res, next) => {
        try {
            const currentUserId = req.user?.id;
            const { userId } = req.params;
            const user = await this.userService.getUserProfile(userId, currentUserId);
            res.status(200).json({ message: "User profile retrieved successfully", success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    };
    updateProfile = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const updatedUser = await this.userService.updateProfile(userId, req.body);
            res.status(200).json({ message: "Profile updated successfully", success: true, data: updatedUser });
        }
        catch (error) {
            next(error);
        }
    };
    followUser = async (req, res, next) => {
        try {
            const currentUserId = req.user?.id;
            const { userId } = req.params;
            const result = await this.userService.followUser(currentUserId, userId);
            res.status(200).json({ message: result.message, success: true, data: { status: result.status } });
        }
        catch (error) {
            next(error);
        }
    };
    unfollowUser = async (req, res, next) => {
        try {
            const currentUserId = req.user?.id;
            const { userId } = req.params;
            await this.userService.unfollowUser(currentUserId, userId);
            res.status(200).json({ message: "User unfollowed successfully", success: true });
        }
        catch (error) {
            next(error);
        }
    };
    acceptFollowRequest = async (req, res, next) => {
        try {
            const currentUserId = req.user?.id;
            const { requesterId } = req.params;
            await this.userService.acceptFollowRequest(currentUserId, requesterId);
            res.status(200).json({ message: "Follow request accepted successfully", success: true });
        }
        catch (error) {
            next(error);
        }
    };
    rejectFollowRequest = async (req, res, next) => {
        try {
            const currentUserId = req.user?.id;
            const { requesterId } = req.params;
            await this.userService.rejectFollowRequest(currentUserId, requesterId);
            res.status(200).json({ message: "Follow request rejected successfully", success: true });
        }
        catch (error) {
            next(error);
        }
    };
    getFollowers = async (req, res, next) => {
        try {
            const { userId } = req.params;
            const followers = await this.userService.getFollowers(userId);
            res.status(200).json({ message: "Followers retrieved successfully", success: true, data: followers });
        }
        catch (error) {
            next(error);
        }
    };
    getFollowing = async (req, res, next) => {
        try {
            const { userId } = req.params;
            const following = await this.userService.getFollowing(userId);
            res.status(200).json({ message: "Following retrieved successfully", success: true, data: following });
        }
        catch (error) {
            next(error);
        }
    };
    searchUsers = async (req, res, next) => {
        try {
            const currentUserId = req.user?.id;
            const query = req.query.q || "";
            const users = await this.userService.searchUsers(query, currentUserId);
            res.status(200).json({ message: "Users retrieved successfully", success: true, data: users });
        }
        catch (error) {
            next(error);
        }
    };
    getSuggestedUsers = async (req, res, next) => {
        try {
            const currentUserId = req.user?.id;
            const users = await this.userService.getSuggestedUsers(currentUserId);
            res.status(200).json({ message: "Suggestions retrieved successfully", success: true, data: users });
        }
        catch (error) {
            next(error);
        }
    };
    getAccountSettings = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const settings = await this.userService.getAccountSettings(userId);
            res.status(200).json({ message: "Account settings retrieved successfully", success: true, data: settings });
        }
        catch (error) {
            next(error);
        }
    };
    updatePrivacy = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const settings = await this.userService.updatePrivacy(userId, req.body);
            res.status(200).json({ message: "Privacy settings updated successfully", success: true, data: settings });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.UserService)),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
