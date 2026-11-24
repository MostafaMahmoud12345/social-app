import { App ,cert,initializeApp} from 'firebase-admin/app'
import { INotifactionProvider } from "./notifaction.interface";
import { getMessaging ,Message} from 'firebase-admin/messaging';

class FireBaseProvider implements INotifactionProvider{
    private readonly client:App;
    constructor(config:any){
        this.client=initializeApp({
  credential: cert(config)
});
    }
    async send(to: string, title: string, body: string): Promise<void> {
        const message:Message={
            token:to,
            notification:{
                title
            }
        }
        await getMessaging(this.client).send(message)
    }
}