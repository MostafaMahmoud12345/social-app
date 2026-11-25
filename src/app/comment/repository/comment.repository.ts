import { HydratedDocument } from "mongoose";
import { AbstractRepository } from "../../../lib/abstract.repository/abstract.repository";
import { IComment } from "../interface/comment.interface";
import { Comment } from "../model/comment.model";

export class CommentRepository extends AbstractRepository<IComment> {
    constructor() {
        super(Comment);
    }

    async findAllByPost(postId: string): Promise<HydratedDocument<IComment>[]> {
        return await Comment.find({ postId }).sort({ createdAt: -1 });
    }
}

export default new CommentRepository();
