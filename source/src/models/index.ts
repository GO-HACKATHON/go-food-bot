import * as moment from 'moment';
import {assert} from 'chai';

import * as Rx from 'rxjs/Rx';

declare let require:any;

const RiveScript = require("rivescript");

/**
 * Please dont use 0 as the value
 */
export enum MessageTypes{
    RegularText = 1
}

export class MessageModel{
    public Message:string = "";
    public MessageType:MessageTypes = MessageTypes.RegularText;
    public IsFromMe:boolean = false;    
    public User:UserModel = new UserModel();
    public SentTime:number = 0;

    constructor(message:string, messageType:MessageTypes){
        message = message || "";
        if (message.length <= 0){
            throw new Error("Message must not empty")
        }

        this.Message = message;

        messageType = messageType || MessageTypes.RegularText;
        this.MessageType = messageType;

        this.SentTime = moment(new Date()).valueOf();
    }
}

export class UserModel{
    public PicUrl:string = "";
    public Username:string = "";
}

export interface IUserRetriever{
    getUser():Rx.Observable<UserModel>;
}

export class GofoodBot{

    constructor(private userRetriever:IUserRetriever){
        assert.isNotNull(this.userRetriever, "userRetriever must not null");

    }

    public getTypingsMessage():Rx.Observable<MessageModel>{
        return this.userRetriever.getUser()
                .flatMap((user:UserModel) =>{
                    return this.getBotUser()
                            .map((botUser:UserModel) =>{
                                return {
                                    user,
                                    botUser
                                }
                            })
                })
                .map((combined:any) => {                    
                    let message:MessageModel = new MessageModel(`Typings...`, MessageTypes.RegularText);
                    message.User = combined.botUser;

                    return message;
                })
        
    }

    public sayGreetings():Rx.Observable<MessageModel>{
        return this.userRetriever.getUser()
                .flatMap((user:UserModel) =>{
                    return this.getBotUser()
                            .map((botUser:UserModel) =>{
                                return {
                                    user,
                                    botUser
                                }
                            })
                })
                .map((combined:any) => {                    
                    let message:MessageModel = new MessageModel(`Halo ${combined.user.Username}! Kamu mau langsung pesan atau lihat menu?`, MessageTypes.RegularText);
                    message.User = combined.botUser;

                    return message;
                })
        
    }

    public getBotUser():Rx.Observable<UserModel>{
        let user:UserModel = new UserModel();
        user.PicUrl = "https://mustafit.files.wordpress.com/2017/01/gofood.jpg";
        user.Username = "Go-food Bot";

        return Rx.Observable.from([user]);
    }

    public static Create():GofoodBot{
        return new GofoodBot(new DummyCurrentUserRetriever())
    }
}


export class DummyCurrentUserRetriever implements IUserRetriever{

    getUser():Rx.Observable<UserModel>{
        let user:UserModel = new UserModel();
        user.PicUrl = "https://avatars3.githubusercontent.com/u/393533?v=3&u=cb9508c2c45ea4a8677c2f99a6de73c015bf8db0&s=400";
        user.Username = "Irwansyah";

        return Rx.Observable.from([user]);
    }

}