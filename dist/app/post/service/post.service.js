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
exports.PostService = void 0;
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../lib/di/tokens");
const post_repository_1 = require("../repository/post.repository");
const errors_1 = require("../errors");
let PostService = class PostService {
    postRepository;
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    createPost = async (dto, userId) => {
        const post = await this.postRepository.create({
            content: dto.content,
            userId: userId,
            commentCount: 0,
            reactionCount: 0,
        });
        return post;
    };
    getAllMyPosts = async (userId) => {
        return await this.postRepository.findAllByUser(userId);
    };
    getSinglePost = async (postId) => {
        const post = await this.postRepository.getOne({ _id: postId });
        if (!post)
            throw errors_1.postNotFound;
        return post;
    };
    updatePost = async (postId, dto, userId) => {
        const post = await this.postRepository.getOne({ _id: postId });
        if (!post)
            throw errors_1.postNotFound;
        if (post.userId.toString() !== userId)
            throw errors_1.notPostOwner;
        const updatedPost = await this.postRepository.update({ _id: postId }, { content: dto.content }, { new: true });
        return updatedPost;
    };
    deletePost = async (postId, userId) => {
        const post = await this.postRepository.getOne({ _id: postId });
        if (!post)
            throw errors_1.postNotFound;
        if (post.userId.toString() !== userId)
            throw errors_1.notPostOwner;
        await this.postRepository.delete({ _id: postId });
    };
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.PostRepository)),
    __metadata("design:paramtypes", [post_repository_1.PostRepository])
], PostService);
