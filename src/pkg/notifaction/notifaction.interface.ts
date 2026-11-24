export interface INotifactionProvider{
    send(to:string,title:string,body:string):Promise<void>;
}
