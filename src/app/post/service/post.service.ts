import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../lib/di/tokens";
import { PostRepository } from "../repository/post.repository";
import { CreatePostDto, UpdatePostDto } from "../dto/post.dto";
import { postNotFound, notPostOwner } from "../errors";

@injectable()
export class PostService {
    constructor(
        @inject(TOKENS.PostRepository) private readonly postRepository: PostRepository
    ) {}

    createPost = async (dto: CreatePostDto, userId: string) => {
        const post = await this.postRepository.create({
            content: dto.content,
            userId: userId as any,
            commentCount: 0,
            reactionCount: 0,
        });
        return post;
    };

    getAllMyPosts = async (userId: string) => {
        return await this.postRepository.findAllByUser(userId);
    };

    getSinglePost = async (postId: string) => {
        const post = await this.postRepository.getOne({ _id: postId });
        if (!post) throw postNotFound;
        return post;
    };

    updatePost = async (postId: string, dto: UpdatePostDto, userId: string) => {
        const post = await this.postRepository.getOne({ _id: postId });
        if (!post) throw postNotFound;
        if (post.userId.toString() !== userId) throw notPostOwner;

        const updatedPost = await this.postRepository.update(
            { _id: postId },
            { content: dto.content },
            { new: true }
        );
        return updatedPost;
    };

    deletePost = async (postId: string, userId: string) => {
        const post = await this.postRepository.getOne({ _id: postId });
        if (!post) throw postNotFound;
        if (post.userId.toString() !== userId) throw notPostOwner;

        await this.postRepository.delete({ _id: postId });
    };
}
