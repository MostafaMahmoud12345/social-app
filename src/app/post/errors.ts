import { AppError } from "../../lib/error/error";

export const postNotFound    = new AppError("Post not found", 404);
export const notPostOwner    = new AppError("You are not allowed to perform this action", 403);
