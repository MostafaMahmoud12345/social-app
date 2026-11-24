import {createTransport, Transport, Transporter}from 'nodemailer'
import { INotifactionProvider } from './notifaction.interface';
interface InodeMailerConfig{
   name:string;
   pass:string;
}

export class NodeMailerProvider implements INotifactionProvider {
   private client:Transporter;
    private readonly fromEmail:string;

    constructor(config:InodeMailerConfig) {
        this.client =createTransport({
         host: "smtp.gmail.com",
        port: 465,
        secure:true,
    auth: {
        user: config.name,
        pass:config.pass}
            });
        this.fromEmail  = config.name as string;
    }

    async send(to:string, title:string, body:string) {
   await this.client.sendMail({
        from: this.fromEmail,
        to:to,
        subject: title,
        html: body
    });
 
}
}