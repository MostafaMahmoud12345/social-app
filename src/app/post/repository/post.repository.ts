import { HydratedDocument } from "mongoose";
import { AbstractRepository } from "../../../lib/abstract.repository/abstract.repository";
import { IPost } from "../interface/post.interface";
import { Post } from "../model/post.model";

export class PostRepository extends AbstractRepository<IPost> {
    constructor() {
        super(Post);
    }

    async findAllByUser(userId: string): Promise<HydratedDocument<IPost>[]> {
        return await Post.find({ userId }).sort({ createdAt: -1 });
    }
}

export default new PostRepository();
