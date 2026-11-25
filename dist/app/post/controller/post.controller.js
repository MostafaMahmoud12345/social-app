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
exports.PostController = void 0;
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../lib/di/tokens");
const post_service_1 = require("../service/post.service");
let PostController = class PostController {
    postService;
    constructor(postService) {
        this.postService = postService;
    }
    createPost = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const post = await this.postService.createPost(req.body, userId);
            res.status(201).json({ message: "Post created successfully", success: true, data: post });
        }
        catch (error) {
            next(error);
        }
    };
    getAllMyPosts = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const posts = await this.postService.getAllMyPosts(userId);
            res.status(200).json({ message: "Posts retrieved successfully", success: true, data: posts });
        }
        catch (error) {
            next(error);
        }
    };
    getSinglePost = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const post = await this.postService.getSinglePost(postId);
            res.status(200).json({ message: "Post retrieved successfully", success: true, data: post });
        }
        catch (error) {
            next(error);
        }
    };
    updatePost = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const { postId } = req.params;
            const updatedPost = await this.postService.updatePost(postId, req.body, userId);
            res.status(200).json({ message: "Post updated successfully", success: true, data: updatedPost });
        }
        catch (error) {
            next(error);
        }
    };
    deletePost = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const { postId } = req.params;
            await this.postService.deletePost(postId, userId);
            res.status(200).json({ message: "Post deleted successfully", success: true });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.PostController = PostController;
exports.PostController = PostController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.PostService)),
    __metadata("design:paramtypes", [post_service_1.PostService])
], PostController);
