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
const node_fs_1 = __importDefault(require("node:fs"));
const tsyringe_1 = require("tsyringe");
const user_repository_1 = require("../repository/user.repository");
const error_1 = require("../../../lib/error/error");
const tokens_1 = require("../../../lib/di/tokens");
const errors_1 = require("../errors");
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
            throw new error_1.AppError("profile picture not found", 404);
        }
        await this.cloudProvider.deleteFile(user.profilePicturePath);
        await this.userRepository.update({ _id: userId }, { $unset: { profilePicturePath: "" } });
    };
    getMyProfile = async (userId) => {
        const user = await this.userRepository.findByIdSafe(userId);
        if (!user)
            throw errors_1.userNotExist;
        return user;
    };
    getUserProfile = async (targetUserId, currentUserId) => {
        const targetUser = await this.userRepository.findByIdSafe(targetUserId);
        if (!targetUser)
            throw errors_1.userNotExist;
        const isOwner = targetUser._id.toString() === currentUserId;
        const isFollower = targetUser.followers?.some((id) => id.toString() === currentUserId);
        if (targetUser.isPrivate && !isOwner && !isFollower) {
            return {
                _id: targetUser._id,
                userName: targetUser.userName,
                profilePicturePath: targetUser.profilePicturePath,
                isPrivate: targetUser.isPrivate,
                followersCount: targetUser.followers?.length ?? 0,
                followingCount: targetUser.following?.length ?? 0,
            };
        }
        return targetUser;
    };
    updateProfile = async (userId, dto) => {
        const updatedUser = await this.userRepository.update({ _id: userId, isDeleted: false }, {
            ...(dto.userName !== undefined && { userName: dto.userName }),
            ...(dto.bio !== undefined && { bio: dto.bio }),
            ...(dto.phoneNumber !== undefined && { phoneNumber: dto.phoneNumber }),
            ...(dto.gender !== undefined && { gender: dto.gender }),
        }, { new: true, select: "-password" });
        if (!updatedUser)
            throw errors_1.userNotExist;
        return updatedUser;
    };
    followUser = async (currentUserId, targetUserId) => {
        if (currentUserId === targetUserId)
            throw errors_1.cannotFollowSelf;
        const targetUser = await this.userRepository.findByIdSafe(targetUserId);
        if (!targetUser)
            throw errors_1.userNotExist;
        const isAlreadyFollowing = targetUser.followers?.some((id) => id.toString() === currentUserId);
        if (isAlreadyFollowing)
            throw errors_1.alreadyFollowing;
        if (targetUser.isPrivate) {
            const alreadyRequested = targetUser.followRequests?.some((id) => id.toString() === currentUserId);
            if (alreadyRequested)
                throw errors_1.followRequestAlreadySent;
            await this.userRepository.update({ _id: targetUserId }, { $addToSet: { followRequests: currentUserId } });
            return { status: "requested", message: "Follow request sent successfully" };
        }
        await this.userRepository.update({ _id: targetUserId }, { $addToSet: { followers: currentUserId } });
        await this.userRepository.update({ _id: currentUserId }, { $addToSet: { following: targetUserId } });
        return { status: "following", message: "User followed successfully" };
    };
    unfollowUser = async (currentUserId, targetUserId) => {
        if (currentUserId === targetUserId)
            throw errors_1.cannotFollowSelf;
        const targetUser = await this.userRepository.findByIdSafe(targetUserId);
        if (!targetUser)
            throw errors_1.userNotExist;
        const isFollowing = targetUser.followers?.some((id) => id.toString() === currentUserId);
        if (!isFollowing)
            throw errors_1.notFollowing;
        await this.userRepository.update({ _id: targetUserId }, { $pull: { followers: currentUserId } });
        await this.userRepository.update({ _id: currentUserId }, { $pull: { following: targetUserId } });
    };
    acceptFollowRequest = async (currentUserId, requesterId) => {
        const currentUser = await this.userRepository.findByIdSafe(currentUserId);
        if (!currentUser)
            throw errors_1.userNotExist;
        const hasRequest = currentUser.followRequests?.some((id) => id.toString() === requesterId);
        if (!hasRequest)
            throw errors_1.followRequestNotFound;
        await this.userRepository.update({ _id: currentUserId }, {
            $pull: { followRequests: requesterId },
            $addToSet: { followers: requesterId },
        });
        await this.userRepository.update({ _id: requesterId }, { $addToSet: { following: currentUserId } });
    };
    rejectFollowRequest = async (currentUserId, requesterId) => {
        const currentUser = await this.userRepository.findByIdSafe(currentUserId);
        if (!currentUser)
            throw errors_1.userNotExist;
        const hasRequest = currentUser.followRequests?.some((id) => id.toString() === requesterId);
        if (!hasRequest)
            throw errors_1.followRequestNotFound;
        await this.userRepository.update({ _id: currentUserId }, { $pull: { followRequests: requesterId } });
    };
    getFollowers = async (userId) => {
        const user = await this.userRepository.getPopulatedFollowers(userId);
        if (!user)
            throw errors_1.userNotExist;
        return user.followers ?? [];
    };
    getFollowing = async (userId) => {
        const user = await this.userRepository.getPopulatedFollowing(userId);
        if (!user)
            throw errors_1.userNotExist;
        return user.following ?? [];
    };
    searchUsers = async (query, currentUserId) => {
        if (!query || !query.trim())
            return [];
        return await this.userRepository.searchUsers(query.trim(), currentUserId);
    };
    getSuggestedUsers = async (currentUserId) => {
        const currentUser = await this.userRepository.findByIdSafe(currentUserId);
        if (!currentUser)
            throw errors_1.userNotExist;
        const followingIds = (currentUser.following ?? []);
        return await this.userRepository.getSuggestions(currentUserId, followingIds);
    };
    getAccountSettings = async (userId) => {
        const user = await this.userRepository.findByIdSafe(userId);
        if (!user)
            throw errors_1.userNotExist;
        return {
            userName: user.userName,
            email: user.email,
            isPrivate: user.isPrivate ?? false,
            twoStepVerification: user.twoStepVerification ?? false,
            isVerified: user.isVerified ?? false,
        };
    };
    updatePrivacy = async (userId, dto) => {
        if (typeof dto.isPrivate !== "boolean") {
            throw new error_1.AppError("isPrivate must be a boolean", 400);
        }
        const updatedUser = await this.userRepository.update({ _id: userId, isDeleted: false }, { isPrivate: dto.isPrivate }, { new: true, select: "userName email isPrivate" });
        if (!updatedUser)
            throw errors_1.userNotExist;
        return updatedUser;
    };
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.UserRepository)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.TOKENS.CloudProvider)),
    __metadata("design:paramtypes", [user_repository_1.UserRepository, Object])
], UserService);
