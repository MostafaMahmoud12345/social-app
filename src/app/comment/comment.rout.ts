import { Router } from "express";
import container from "../../lib/di/container";
import { TOKENS } from "../../lib/di/tokens";
import { CommentController } from "./controller/comment.controller";
import { authGuard } from "../../lib/auth/authGuard";

const commentController = container.resolve<CommentController>(TOKENS.CommentController);

export const commentRouter = Router();

commentRouter.use(authGuard);

commentRouter.get("/:commentId",    commentController.getSingleComment);
commentRouter.patch("/:commentId",  commentController.updateComment);
commentRouter.delete("/:commentId", commentController.deleteComment);
