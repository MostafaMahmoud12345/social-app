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
exports.CommentController = void 0;
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../lib/di/tokens");
const comment_service_1 = require("../service/comment.service");
let CommentController = class CommentController {
    commentService;
    constructor(commentService) {
        this.commentService = commentService;
    }
    createComment = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const { postId } = req.params;
            const comment = await this.commentService.createComment(postId, req.body, userId);
            res.status(201).json({ message: "Comment created successfully", success: true, data: comment });
        }
        catch (error) {
            next(error);
        }
    };
    getPostComments = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const comments = await this.commentService.getPostComments(postId);
            res.status(200).json({ message: "Comments retrieved successfully", success: true, data: comments });
        }
        catch (error) {
            next(error);
        }
    };
    getSingleComment = async (req, res, next) => {
        try {
            const { commentId } = req.params;
            const comment = await this.commentService.getSingleComment(commentId);
            res.status(200).json({ message: "Comment retrieved successfully", success: true, data: comment });
        }
        catch (error) {
            next(error);
        }
    };
    updateComment = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const { commentId } = req.params;
            const updatedComment = await this.commentService.updateComment(commentId, req.body, userId);
            res.status(200).json({ message: "Comment updated successfully", success: true, data: updatedComment });
        }
        catch (error) {
            next(error);
        }
    };
    deleteComment = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const { commentId } = req.params;
            await this.commentService.deleteComment(commentId, userId);
            res.status(200).json({ message: "Comment deleted successfully", success: true });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.CommentController = CommentController;
exports.CommentController = CommentController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.CommentService)),
    __metadata("design:paramtypes", [comment_service_1.CommentService])
], CommentController);
