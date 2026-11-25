import { AppError } from "../../lib/error/error";

export const commentNotFound  = new AppError("Comment not found", 404);
export const notCommentOwner  = new AppError("You are not allowed to perform this action", 403);
