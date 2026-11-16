import { createTransport } from 'nodemailer';
export class NodeMailerProvider {
    client;
    fromEmail;
    constructor(config) {
        this.client = createTransport({
            host: config.host,
            port: config.port,
            secure: false,
            auth: {
                user: config.name,
                pass: config.pass
            }
        });
        this.fromEmail = config.fromEmail;
    }
    async send(email, subject, html) {
        await this.client.sendMail({
            from: this.fromEmail,
            to: email,
            subject: subject,
            html: html
        });
    }
}
