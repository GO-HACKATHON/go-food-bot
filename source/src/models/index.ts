import * as moment from 'moment';
import {assert} from 'chai';

import * as Rx from 'rxjs/Rx';

declare let require:any;

const RiveScript = require("rivescript");

const BrainFiles = [
    "assets/brain/greetings.rive",
    "assets/brain/menu.rive"
]

/**
 * Please dont use 0 as the value
 */
export enum MessageTypes{
    RegularText = 1,
    Typings = 2
}

export class MessageModel{
    public Message:string = "";
    public MessageType:MessageTypes = MessageTypes.RegularText;
    public IsFromMe:boolean = false;    
    public User:UserModel = new UserModel();
    public SentTime:number = 0;

    constructor(message:string, messageType:MessageTypes, user:UserModel){
        message = message || "";
        if (message.length <= 0){
            throw new Error("Message must not empty")
        }

        this.Message = message;

        messageType = messageType || MessageTypes.RegularText;
        this.MessageType = messageType;

        this.User = user;

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

export class DummyCurrentUserRetriever implements IUserRetriever{

    getUser():Rx.Observable<UserModel>{
        let user:UserModel = new UserModel();
        // user.PicUrl = "https://avatars3.githubusercontent.com/u/393533?v=3&u=cb9508c2c45ea4a8677c2f99a6de73c015bf8db0&s=400";
        user.PicUrl = "https://scontent-sit4-1.xx.fbcdn.net/v/t1.0-1/64767_10202758933813512_4581591136467101320_n.jpg?oh=7ae3806f479536b2b8b9a894c08170c9&oe=59553B50";
        user.Username = "Norma";

        return Rx.Observable.from([user]);
    }

}

export class GofoodBot{

    protected botScript:any = new RiveScript()

    constructor(private userRetriever:IUserRetriever){
        assert.isNotNull(this.userRetriever, "userRetriever must not null");

    }

    _initBotBrain():Rx.Observable<void>{
        return Rx.Observable.create(s =>{
            this.botScript.loadFile(BrainFiles, (batch_num) =>{
                console.log('All brain files, loaded');

                this.botScript.sortReplies();

                s.next();
                s.complete();
            }, (err) =>{
                s.error(err);
            })
        })
    }

    init():Rx.Observable<any>{
        return Rx.Observable.from([""])
                .flatMap(() => this._initBotBrain())
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
                    let message:MessageModel = new MessageModel(`Typings...`, MessageTypes.Typings, combined.botUser);

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
                    let message:MessageModel = new MessageModel(`Halo ${combined.user.Username}! Kamu mau langsung pesan atau lihat menu?`, MessageTypes.RegularText, combined.user);
                    message.User = combined.botUser;

                    return message;
                })
        
    }

    public getReply(userMessage:MessageModel):Rx.Observable<MessageModel>{
        
        let reply:string = this.botScript.reply("local-user", userMessage.Message);

        console.log('userMessage:', userMessage, 'reply:', reply)

        return this.getBotUser()
                .map((botUser:UserModel) => {
                    let replyModel:MessageModel = new MessageModel(reply, MessageTypes.RegularText, botUser);

                    return replyModel;
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
