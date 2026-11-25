import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../lib/di/tokens";
import { CommentRepository } from "../repository/comment.repository";
import { PostRepository } from "../../post/repository/post.repository";
import { CreateCommentDto, UpdateCommentDto } from "../dto/comment.dto";
import { commentNotFound, notCommentOwner } from "../errors";
import { postNotFound } from "../../post/errors";

@injectable()
export class CommentService {
    constructor(
        @inject(TOKENS.CommentRepository) private readonly commentRepository: CommentRepository,
        @inject(TOKENS.PostRepository)    private readonly postRepository: PostRepository
    ) {}

    createComment = async (postId: string, dto: CreateCommentDto, userId: string) => {
        const post = await this.postRepository.getOne({ _id: postId });
        if (!post) throw postNotFound;

        const comment = await this.commentRepository.create({
            content: dto.content,
            userId: userId as any,
            postId: postId as any,
        });

        await this.postRepository.update({ _id: postId }, { $inc: { commentCount: 1 } });

        return comment;
    };

    getPostComments = async (postId: string) => {
        const post = await this.postRepository.getOne({ _id: postId });
        if (!post) throw postNotFound;

        return await this.commentRepository.findAllByPost(postId);
    };

    getSingleComment = async (commentId: string) => {
        const comment = await this.commentRepository.getOne({ _id: commentId });
        if (!comment) throw commentNotFound;
        return comment;
    };

    updateComment = async (commentId: string, dto: UpdateCommentDto, userId: string) => {
        const comment = await this.commentRepository.getOne({ _id: commentId });
        if (!comment) throw commentNotFound;

        if (comment.userId.toString() !== userId) throw notCommentOwner;

        const updatedComment = await this.commentRepository.update(
            { _id: commentId },
            { content: dto.content },
            { new: true }
        );
        return updatedComment;
    };

    deleteComment = async (commentId: string, userId: string) => {
        const comment = await this.commentRepository.getOne({ _id: commentId });
        if (!comment) throw commentNotFound;

        const post = await this.postRepository.getOne({ _id: comment.postId });
        const isCommentOwner = comment.userId.toString() === userId;
        const isPostOwner    = post?.userId.toString() === userId;

        if (!isCommentOwner && !isPostOwner) throw notCommentOwner;

        await this.commentRepository.delete({ _id: commentId });

        if (post) {
            await this.postRepository.update({ _id: post._id }, { $inc: { commentCount: -1 } });
        }
    };
}
