import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../lib/di/tokens";
import { CommentService } from "../service/comment.service";

@injectable()
export class CommentController {
    constructor(
        @inject(TOKENS.CommentService) private readonly commentService: CommentService
    ) {}

    createComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id as string;
            const { postId } = req.params;
            const comment = await this.commentService.createComment(postId as string, req.body, userId);
            res.status(201).json({ message: "Comment created successfully", success: true, data: comment });
        } catch (error) {
            next(error);
        }
    };

    getPostComments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { postId } = req.params;
            const comments = await this.commentService.getPostComments(postId as string);
            res.status(200).json({ message: "Comments retrieved successfully", success: true, data: comments });
        } catch (error) {
            next(error);
        }
    };

    getSingleComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { commentId } = req.params;
            const comment = await this.commentService.getSingleComment(commentId as string);
            res.status(200).json({ message: "Comment retrieved successfully", success: true, data: comment });
        } catch (error) {
            next(error);
        }
    };

    updateComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id as string;
            const { commentId } = req.params;
            const updatedComment = await this.commentService.updateComment(commentId as string, req.body, userId);
            res.status(200).json({ message: "Comment updated successfully", success: true, data: updatedComment });
        } catch (error) {
            next(error);
        }
    };

    deleteComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id as string;
            const { commentId } = req.params;
            await this.commentService.deleteComment(commentId as string, userId);
            res.status(200).json({ message: "Comment deleted successfully", success: true });
        } catch (error) {
            next(error);
        }
    };
}
