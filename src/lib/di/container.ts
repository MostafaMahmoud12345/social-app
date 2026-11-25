import { container } from "tsyringe";
import { TOKENS } from "./tokens";

import { UserService }    from "../../app/user/service/user.service";
import { UserController } from "../../app/user/controller/user.controller";
import { UserRepository } from "../../app/user/repository/user.repository";

import { PostService }    from "../../app/post/service/post.service";
import { PostController } from "../../app/post/controller/post.controller";
import { PostRepository } from "../../app/post/repository/post.repository";

import { CommentService }    from "../../app/comment/service/comment.service";
import { CommentController } from "../../app/comment/controller/comment.controller";
import { CommentRepository } from "../../app/comment/repository/comment.repository";

import { cacheProvider }                     from "../cache/init";
import { s3CloudProvider }                   from "../cloud/init";
import { mailjetProvider, nodeMailerProvider } from "../email/init";

import { AuthService }    from "../../app/auth/service/auth.service";
import { AuthController } from "../../app/auth/controller/auth.controller";
import { AuthRepository } from "../../app/auth/repository/auth.repository";

container.registerSingleton(TOKENS.UserService,    UserService);
container.registerSingleton(TOKENS.UserController, UserController);
container.registerSingleton(TOKENS.UserRepository, UserRepository);

container.registerSingleton(TOKENS.PostService,    PostService);
container.registerSingleton(TOKENS.PostController, PostController);
container.registerSingleton(TOKENS.PostRepository, PostRepository);

container.registerSingleton(TOKENS.CommentService,    CommentService);
container.registerSingleton(TOKENS.CommentController, CommentController);
container.registerSingleton(TOKENS.CommentRepository, CommentRepository);

container.registerInstance(TOKENS.CacheProvider,       cacheProvider);
container.registerInstance(TOKENS.CloudProvider,       s3CloudProvider);
container.registerInstance(TOKENS.MailjetProvider,     mailjetProvider);
container.registerInstance(TOKENS.NodeMailerProvider,  nodeMailerProvider);

container.registerSingleton(TOKENS.AuthService,    AuthService);
container.registerSingleton(TOKENS.AuthController, AuthController);
container.registerSingleton(TOKENS.AuthRepository, AuthRepository);

export default container;
