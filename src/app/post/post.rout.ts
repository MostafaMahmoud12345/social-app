import { Router } from "express";
import container from "../../lib/di/container";
import { TOKENS } from "../../lib/di/tokens";
import { PostController } from "./controller/post.controller";
import { CommentController } from "../comment/controller/comment.controller";
import { authGuard } from "../../lib/auth/authGuard";

const postController    = container.resolve<PostController>(TOKENS.PostController);
const commentController = container.resolve<CommentController>(TOKENS.CommentController);

export const postRouter = Router();

postRouter.use(authGuard);

postRouter.post("/",          postController.createPost);
postRouter.get("/",           postController.getAllMyPosts);
postRouter.get("/:postId",    postController.getSinglePost);
postRouter.patch("/:postId",  postController.updatePost);
postRouter.delete("/:postId", postController.deletePost);

postRouter.post("/:postId/comment",  commentController.createComment);
postRouter.get("/:postId/comment",   commentController.getPostComments);
