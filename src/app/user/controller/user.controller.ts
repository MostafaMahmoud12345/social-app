import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user.service";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../lib/di/tokens";

@injectable()
export class UserController {
    constructor(
        @inject(TOKENS.UserService) private readonly userService: UserService
    ) {}

    uploadProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id as string;
            await this.userService.uploadProfilePicture(req.file as Express.Multer.File, userId);
            res.json({ message: "ProfilePicture upload successfully", success: true });
        } catch (error) {
            next(error);
        }
    };

    generatePresigneUrl = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id as string;
            const { fileName, contentType } = req.body;
            const url = await this.userService.generatePresigneUrl(
                { mimetype: contentType, originalname: fileName },
                userId
            );
            res.json({ message: "ok", success: true, data: { url } });
        } catch (error) {
            next(error);
        }
    };

    deletProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id as string;
            await this.userService.deletProfilePicture(userId);
            res.json({ message: "ProfilePicture delete successfully", success: true });
        } catch (error) {
            next(error);
        }
    };

    getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id as string;
            const user = await this.userService.getMyProfile(userId);
            res.status(200).json({ message: "Profile retrieved successfully", success: true, data: user });
        } catch (error) {
            next(error);
        }
    };

    getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const currentUserId = req.user?.id as string;
            const { userId } = req.params;
            const user = await this.userService.getUserProfile(userId as string, currentUserId);
            res.status(200).json({ message: "User profile retrieved successfully", success: true, data: user });
        } catch (error) {
            next(error);
        }
    };

    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id as string;
            const updatedUser = await this.userService.updateProfile(userId, req.body);
            res.status(200).json({ message: "Profile updated successfully", success: true, data: updatedUser });
        } catch (error) {
            next(error);
        }
    };

    followUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const currentUserId = req.user?.id as string;
            const { userId } = req.params;
            const result = await this.userService.followUser(currentUserId, userId as string);
            res.status(200).json({ message: result.message, success: true, data: { status: result.status } });
        } catch (error) {
            next(error);
        }
    };

    unfollowUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const currentUserId = req.user?.id as string;
            const { userId } = req.params;
            await this.userService.unfollowUser(currentUserId, userId as string);
            res.status(200).json({ message: "User unfollowed successfully", success: true });
        } catch (error) {
            next(error);
        }
    };

    acceptFollowRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const currentUserId = req.user?.id as string;
            const { requesterId } = req.params;
            await this.userService.acceptFollowRequest(currentUserId, requesterId as string);
            res.status(200).json({ message: "Follow request accepted successfully", success: true });
        } catch (error) {
            next(error);
        }
    };

    rejectFollowRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const currentUserId = req.user?.id as string;
            const { requesterId } = req.params;
            await this.userService.rejectFollowRequest(currentUserId, requesterId as string) ;
            res.status(200).json({ message: "Follow request rejected successfully", success: true });
        } catch (error) {
            next(error);
        }
    };

    getFollowers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;
            const followers = await this.userService.getFollowers(userId as string);
            res.status(200).json({ message: "Followers retrieved successfully", success: true, data: followers });
        } catch (error) {
            next(error);
        }
    };

    getFollowing = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;
            const following = await this.userService.getFollowing(userId as string);
            res.status(200).json({ message: "Following retrieved successfully", success: true, data: following });
        } catch (error) {
            next(error);
        }
    };

    searchUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const currentUserId = req.user?.id as string;
            const query = (req.query.q as string) || "";
            const users = await this.userService.searchUsers(query, currentUserId);
            res.status(200).json({ message: "Users retrieved successfully", success: true, data: users });
        } catch (error) {
            next(error);
        }
    };

    getSuggestedUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const currentUserId = req.user?.id as string;
            const users = await this.userService.getSuggestedUsers(currentUserId);
            res.status(200).json({ message: "Suggestions retrieved successfully", success: true, data: users });
        } catch (error) {
            next(error);
        }
    };

    getAccountSettings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id as string;
            const settings = await this.userService.getAccountSettings(userId);
            res.status(200).json({ message: "Account settings retrieved successfully", success: true, data: settings });
        } catch (error) {
            next(error);
        }
    };

    updatePrivacy = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id as string;
            const settings = await this.userService.updatePrivacy(userId, req.body);
            res.status(200).json({ message: "Privacy settings updated successfully", success: true, data: settings });
        } catch (error) {
            next(error);
        }
    };
}
