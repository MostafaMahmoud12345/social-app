"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../lib/di/tokens");
const comment_repository_1 = require("../repository/comment.repository");
const post_repository_1 = require("../../post/repository/post.repository");
const errors_1 = require("../errors");
const errors_2 = require("../../post/errors");
let CommentService = class CommentService {
    commentRepository;
    postRepository;
    constructor(commentRepository, postRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }
    createComment = async (postId, dto, userId) => {
        const post = await this.postRepository.getOne({ _id: postId });
        if (!post)
            throw errors_2.postNotFound;
        const comment = await this.commentRepository.create({
            content: dto.content,
            userId: userId,
            postId: postId,
        });
        await this.postRepository.update({ _id: postId }, { $inc: { commentCount: 1 } });
        return comment;
    };
    getPostComments = async (postId) => {
        const post = await this.postRepository.getOne({ _id: postId });
        if (!post)
            throw errors_2.postNotFound;
        return await this.commentRepository.findAllByPost(postId);
    };
    getSingleComment = async (commentId) => {
        const comment = await this.commentRepository.getOne({ _id: commentId });
        if (!comment)
            throw errors_1.commentNotFound;
        return comment;
    };
    updateComment = async (commentId, dto, userId) => {
        const comment = await this.commentRepository.getOne({ _id: commentId });
        if (!comment)
            throw errors_1.commentNotFound;
        if (comment.userId.toString() !== userId)
            throw errors_1.notCommentOwner;
        const updatedComment = await this.commentRepository.update({ _id: commentId }, { content: dto.content }, { new: true });
        return updatedComment;
    };
    deleteComment = async (commentId, userId) => {
        const comment = await this.commentRepository.getOne({ _id: commentId });
        if (!comment)
            throw errors_1.commentNotFound;
        const post = await this.postRepository.getOne({ _id: comment.postId });
        const isCommentOwner = comment.userId.toString() === userId;
        const isPostOwner = post?.userId.toString() === userId;
        if (!isCommentOwner && !isPostOwner)
            throw errors_1.notCommentOwner;
        await this.commentRepository.delete({ _id: commentId });
        if (post) {
            await this.postRepository.update({ _id: post._id }, { $inc: { commentCount: -1 } });
        }
    };
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.CommentRepository)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.TOKENS.PostRepository)),
    __metadata("design:paramtypes", [comment_repository_1.CommentRepository, post_repository_1.PostRepository])
], CommentService);
