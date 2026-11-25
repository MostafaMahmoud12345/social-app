import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../lib/di/tokens";
import { PostService } from "../service/post.service";

@injectable()
export class PostController {
    constructor(
        @inject(TOKENS.PostService) private readonly postService: PostService
    ) {}

    createPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id as string;
            const post = await this.postService.createPost(req.body, userId);
            res.status(201).json({ message: "Post created successfully", success: true, data: post });
        } catch (error) {
            next(error);
        }
    };

    getAllMyPosts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id as string;
            const posts = await this.postService.getAllMyPosts(userId);
            res.status(200).json({ message: "Posts retrieved successfully", success: true, data: posts });
        } catch (error) {
            next(error);
        }
    };

    getSinglePost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { postId } = req.params;
            const post = await this.postService.getSinglePost(postId as string);
            res.status(200).json({ message: "Post retrieved successfully", success: true, data: post });
        } catch (error) {
            next(error);
        }
    };

    updatePost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id as string;
            const { postId } = req.params;
            const updatedPost = await this.postService.updatePost(postId as string, req.body, userId);
            res.status(200).json({ message: "Post updated successfully", success: true, data: updatedPost });
        } catch (error) {
            next(error);
        }
    };

    deletePost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id as string;
            const { postId } = req.params;
            await this.postService.deletePost(postId as string, userId);
            res.status(200).json({ message: "Post deleted successfully", success: true });
        } catch (error) {
            next(error);
        }
    };
}
