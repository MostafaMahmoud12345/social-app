import { AbstractRepository } from "../../../lib/abstract.repository/abstract.repository";
import { IPost } from "../interface/post.interface";
import { Post } from "../model/post.model";

 export class PostRepository extends AbstractRepository<IPost>{
    constructor(){
        super(Post)
    }
}
export default new PostRepository()