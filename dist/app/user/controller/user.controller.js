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
exports.UserController = void 0;
const user_service_1 = require("../service/user.service");
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../lib/di/tokens");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    uploadProfilePicture = async (req, res, next) => {
        try {
            await this.userService.uploadProfilePicture(req.file, '6afe11b2307d7b482c2abce7');
            res.json({ message: "ProfilePicture upload successfully", success: true });
        }
        catch (error) {
            next(error);
        }
    };
    generatePresigneUrl = async (req, res, next) => {
        try {
            const { fileName, contentType } = req.body;
            const url = await this.userService.generatePresigneUrl({ mimetype: contentType, originalname: fileName }, '6afe11b2307d7b482c2abce7');
            res.json({ message: "ok", success: true, data: { url } });
        }
        catch (error) {
            next(error);
        }
    };
    deletProfilePicture = async (req, res, next) => {
        try {
            await this.userService.deletProfilePicture('6afe11b2307d7b482c2abce7');
            res.json({ message: "ProfilePicture delete successfully", success: true });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.UserService)),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
