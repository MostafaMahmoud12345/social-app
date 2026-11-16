import { AbstractRepository } from "../../../lib/abstract.repository/abstract.repository";
import { Post } from "../model/post.model";
class PostRepository extends AbstractRepository {
    constructor() {
        super(Post);
    }
}
export default new PostRepository();
