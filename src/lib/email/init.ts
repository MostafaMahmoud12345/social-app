import { config } from 'dotenv';
import {MailjetProvider} from "../../pkg/notifaction/mailjet.js";
import { NodeMailerProvider } from "../../pkg/notifaction/nodemailer.js";
import {env} from "../config/env.js";

export const mailjetProvider = new MailjetProvider({
    apiKey: env.mailjet.apiKey,
    apiSecret: env.mailjet.apiSecret,
    fromEmail: env.mailjet.fromEmail,
    fromName: env.mailjet.fromName,
});

export const nodeMailerProvider = new NodeMailerProvider(env.nodemailer);