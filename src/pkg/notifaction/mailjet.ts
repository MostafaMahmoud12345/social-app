import Mailjet from "node-mailjet";
import { INotifactionProvider } from "./notifaction.interface";
interface ImailJetConfig{
   apiKey:string,
    apiSecret:string,
    fromEmail:string,
    fromName:string
}

export class MailjetProvider implements INotifactionProvider {
   private client:Mailjet;
    private readonly fromEmail:string;
    private readonly fromName:string;

    constructor(config:ImailJetConfig) {
        this.client = new Mailjet({
            apiKey: config.apiKey, apiSecret: config.apiSecret,
        });
        this.fromName = config.fromName;
        this.fromEmail = config.fromEmail;
    }

    async send(to:string, title:string, body:string) {

       await this.client.post('send', {version: 'v3.1'}).request({
            Messages: [{
                From: {
                    Email: this.fromEmail, Name: this.fromName,
                }, To: [{
                    Email: to,
                },], Subject: title,
                HTMLPart: body
            },],
        });
    }
}