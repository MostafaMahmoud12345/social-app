"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeMailerProvider = void 0;
const nodemailer_1 = require("nodemailer");
class NodeMailerProvider {
    client;
    fromEmail;
    constructor(config) {
        this.client = (0, nodemailer_1.createTransport)({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: config.name,
                pass: config.pass
            }
        });
        this.fromEmail = config.name;
    }
    async send(to, title, body) {
        await this.client.sendMail({
            from: this.fromEmail,
            to: to,
            subject: title,
            html: body
        });
    }
}
exports.NodeMailerProvider = NodeMailerProvider;
