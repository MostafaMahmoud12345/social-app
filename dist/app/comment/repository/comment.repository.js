"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepository = void 0;
const abstract_repository_1 = require("../../../lib/abstract.repository/abstract.repository");
const comment_model_1 = require("../model/comment.model");
class CommentRepository extends abstract_repository_1.AbstractRepository {
    constructor() {
        super(comment_model_1.Comment);
    }
    async findAllByPost(postId) {
        return await comment_model_1.Comment.find({ postId }).sort({ createdAt: -1 });
    }
}
exports.CommentRepository = CommentRepository;
exports.default = new CommentRepository();
