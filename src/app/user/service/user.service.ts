import fs from "node:fs";
import { inject, injectable } from "tsyringe";
import { Types } from "mongoose";
import { UserRepository } from "../repository/user.repository";
import { IcloudProvider } from "../../../pkg/cloud/cloud.interface";
import { AppError } from "../../../lib/error/error";
import { TOKENS } from "../../../lib/di/tokens";
import { UpdatePrivacyDto, UpdateProfileDto } from "../dto/user.dto";
import {
    alreadyFollowing,
    cannotFollowSelf,
    followRequestAlreadySent,
    followRequestNotFound,
    notFollowing,
    userNotExist,
} from "../errors";

@injectable()
export class UserService {
    constructor(
        @inject(TOKENS.UserRepository) private readonly userRepository: UserRepository,
        @inject(TOKENS.CloudProvider) private readonly cloudProvider: IcloudProvider
    ) {}

    uploadProfilePicture = async (file: Express.Multer.File, userId: string) => {
        file.buffer = fs.readFileSync(file.path);
        const key = await this.cloudProvider.uploudFile(file, `users/${userId}`);
        await this.userRepository.update({ _id: userId }, { profilePicturePath: key });
    };

    generatePresigneUrl = async (file: Partial<Express.Multer.File>, userId: string) => {
        return await this.cloudProvider.generatePresigneUrl(file, `users/${userId}`);
    };

    deletProfilePicture = async (userId: string) => {
        const user = await this.userRepository.getOne({ _id: userId });
        if (!user?.profilePicturePath) {
            throw new AppError("profile picture not found", 404);
        }
        await this.cloudProvider.deleteFile(user.profilePicturePath);
        await this.userRepository.update({ _id: userId }, { $unset: { profilePicturePath: "" } });
    };

    getMyProfile = async (userId: string) => {
        const user = await this.userRepository.findByIdSafe(userId);
        if (!user) throw userNotExist;
        return user;
    };

    getUserProfile = async (targetUserId: string, currentUserId: string) => {
        const targetUser = await this.userRepository.findByIdSafe(targetUserId);
        if (!targetUser) throw userNotExist;

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

    updateProfile = async (userId: string, dto: UpdateProfileDto) => {
        const updatedUser = await this.userRepository.update(
            { _id: userId, isDeleted: false },
            {
                ...(dto.userName !== undefined && { userName: dto.userName }),
                ...(dto.bio !== undefined && { bio: dto.bio }),
                ...(dto.phoneNumber !== undefined && { phoneNumber: dto.phoneNumber }),
                ...(dto.gender !== undefined && { gender: dto.gender }),
            },
            { new: true, select: "-password" }
        );
        if (!updatedUser) throw userNotExist;
        return updatedUser;
    };

    followUser = async (currentUserId: string, targetUserId: string) => {
        if (currentUserId === targetUserId) throw cannotFollowSelf;

        const targetUser = await this.userRepository.findByIdSafe(targetUserId);
        if (!targetUser) throw userNotExist;

        const isAlreadyFollowing = targetUser.followers?.some((id) => id.toString() === currentUserId);
        if (isAlreadyFollowing) throw alreadyFollowing;

        if (targetUser.isPrivate) {
            const alreadyRequested = targetUser.followRequests?.some((id) => id.toString() === currentUserId);
            if (alreadyRequested) throw followRequestAlreadySent;

            await this.userRepository.update(
                { _id: targetUserId },
                { $addToSet: { followRequests: currentUserId } }
            );
            return { status: "requested", message: "Follow request sent successfully" };
        }

        await this.userRepository.update(
            { _id: targetUserId },
            { $addToSet: { followers: currentUserId } }
        );
        await this.userRepository.update(
            { _id: currentUserId },
            { $addToSet: { following: targetUserId } }
        );
        return { status: "following", message: "User followed successfully" };
    };

    unfollowUser = async (currentUserId: string, targetUserId: string) => {
        if (currentUserId === targetUserId) throw cannotFollowSelf;

        const targetUser = await this.userRepository.findByIdSafe(targetUserId);
        if (!targetUser) throw userNotExist;

        const isFollowing = targetUser.followers?.some((id) => id.toString() === currentUserId);
        if (!isFollowing) throw notFollowing;

        await this.userRepository.update(
            { _id: targetUserId },
            { $pull: { followers: currentUserId } }
        );
        await this.userRepository.update(
            { _id: currentUserId },
            { $pull: { following: targetUserId } }
        );
    };

    acceptFollowRequest = async (currentUserId: string, requesterId: string) => {
        const currentUser = await this.userRepository.findByIdSafe(currentUserId);
        if (!currentUser) throw userNotExist;

        const hasRequest = currentUser.followRequests?.some((id) => id.toString() === requesterId);
        if (!hasRequest) throw followRequestNotFound;

        await this.userRepository.update(
            { _id: currentUserId },
            {
                $pull: { followRequests: requesterId },
                $addToSet: { followers: requesterId },
            }
        );
        await this.userRepository.update(
            { _id: requesterId },
            { $addToSet: { following: currentUserId } }
        );
    };

    rejectFollowRequest = async (currentUserId: string, requesterId: string) => {
        const currentUser = await this.userRepository.findByIdSafe(currentUserId);
        if (!currentUser) throw userNotExist;

        const hasRequest = currentUser.followRequests?.some((id) => id.toString() === requesterId);
        if (!hasRequest) throw followRequestNotFound;

        await this.userRepository.update(
            { _id: currentUserId },
            { $pull: { followRequests: requesterId } }
        );
    };

    getFollowers = async (userId: string) => {
        const user = await this.userRepository.getPopulatedFollowers(userId);
        if (!user) throw userNotExist;
        return user.followers ?? [];
    };

    getFollowing = async (userId: string) => {
        const user = await this.userRepository.getPopulatedFollowing(userId);
        if (!user) throw userNotExist;
        return user.following ?? [];
    };

    searchUsers = async (query: string, currentUserId: string) => {
        if (!query || !query.trim()) return [];
        return await this.userRepository.searchUsers(query.trim(), currentUserId);
    };

    getSuggestedUsers = async (currentUserId: string) => {
        const currentUser = await this.userRepository.findByIdSafe(currentUserId);
        if (!currentUser) throw userNotExist;
        const followingIds = (currentUser.following ?? []) as Types.ObjectId[];
        return await this.userRepository.getSuggestions(currentUserId, followingIds);
    };

    getAccountSettings = async (userId: string) => {
        const user = await this.userRepository.findByIdSafe(userId);
        if (!user) throw userNotExist;
        return {
            userName: user.userName,
            email: user.email,
            isPrivate: user.isPrivate ?? false,
            twoStepVerification: user.twoStepVerification ?? false,
            isVerified: user.isVerified ?? false,
        };
    };

    updatePrivacy = async (userId: string, dto: UpdatePrivacyDto) => {
        if (typeof dto.isPrivate !== "boolean") {
            throw new AppError("isPrivate must be a boolean", 400);
        }
        const updatedUser = await this.userRepository.update(
            { _id: userId, isDeleted: false },
            { isPrivate: dto.isPrivate },
            { new: true, select: "userName email isPrivate" }
        );
        if (!updatedUser) throw userNotExist;
        return updatedUser;
    };
}
