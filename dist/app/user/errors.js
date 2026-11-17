"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userNotVerified = exports.userAlreadyVerified = exports.userAlreadyExist = exports.userNotExist = void 0;
const error_js_1 = require("../../lib/error/error.js");
exports.userNotExist = new error_js_1.AppError('User Not Exists.', 404); // 404
exports.userAlreadyExist = new error_js_1.AppError('User Already Exists.', 409); // 409
exports.userAlreadyVerified = new error_js_1.AppError('User Already Verified.', 400); // 400
exports.userNotVerified = new error_js_1.AppError('user Not Verified', 403); // 403
