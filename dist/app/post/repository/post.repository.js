"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const abstract_repository_1 = require("../../../lib/abstract.repository/abstract.repository");
const post_model_1 = require("../model/post.model");
class PostRepository extends abstract_repository_1.AbstractRepository {
    constructor() {
        super(post_model_1.Post);
    }
    async findAllByUser(userId) {
        return await post_model_1.Post.find({ userId }).sort({ createdAt: -1 });
    }
}
exports.PostRepository = PostRepository;
exports.default = new PostRepository();
