"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeMailerProvider = exports.mailjetProvider = void 0;
const mailjet_js_1 = require("../../pkg/email/mailjet.js");
const nodemailer_js_1 = require("../../pkg/email/nodemailer.js");
const env_js_1 = require("../config/env.js");
exports.mailjetProvider = new mailjet_js_1.MailjetProvider({
    apiKey: env_js_1.env.mailjet.apiKey,
    apiSecret: env_js_1.env.mailjet.apiSecret,
    fromEmail: env_js_1.env.mailjet.fromEmail,
    fromName: env_js_1.env.mailjet.fromName,
});
exports.nodeMailerProvider = new nodemailer_js_1.NodeMailerProvider(env_js_1.env.nodemailer);
