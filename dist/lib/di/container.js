"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("./tokens");
const user_service_1 = require("../../app/user/service/user.service");
const user_controller_1 = require("../../app/user/controller/user.controller");
const user_repository_1 = require("../../app/user/repository/user.repository");
const post_service_1 = require("../../app/post/service/post.service");
const post_controller_1 = require("../../app/post/controller/post.controller");
const post_repository_1 = require("../../app/post/repository/post.repository");
const init_1 = require("../cache/init");
const init_2 = require("../cloud/init");
const init_3 = require("../email/init");
tsyringe_1.container.registerSingleton(tokens_1.TOKENS.UserService, user_service_1.UserService);
tsyringe_1.container.registerSingleton(tokens_1.TOKENS.UserController, user_controller_1.UserController);
tsyringe_1.container.registerSingleton(tokens_1.TOKENS.UserRepository, user_repository_1.UserRepository);
//////////////////////////////////////////////////////////
tsyringe_1.container.registerSingleton(tokens_1.TOKENS.PostService, post_service_1.PostService);
tsyringe_1.container.registerSingleton(tokens_1.TOKENS.PostController, post_controller_1.PostController);
tsyringe_1.container.registerSingleton(tokens_1.TOKENS.PostRepository, post_repository_1.PostRepository);
//////////////////////////////////////////////////////////
tsyringe_1.container.registerInstance(tokens_1.TOKENS.CacheProvider, init_1.cacheProvider);
tsyringe_1.container.registerInstance(tokens_1.TOKENS.CloudProvider, init_2.s3CloudProvider);
tsyringe_1.container.registerInstance(tokens_1.TOKENS.MailjetProvider, init_3.mailjetProvider);
tsyringe_1.container.registerInstance(tokens_1.TOKENS.MailjetProvider, init_3.nodeMailerProvider);
tsyringe_1.container.registerInstance(tokens_1.TOKENS.MailjetProvider, init_3.mailjetProvider);
exports.default = tsyringe_1.container;
