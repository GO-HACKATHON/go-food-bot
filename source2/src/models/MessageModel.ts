import * as moment from 'moment';
import {assert} from 'chai';

import * as Rx from 'rxjs/Rx';

import {MessageTypes} from './MessageTypes';
import {UserModel} from "./UserModel";

export class MessageModel{
    public Message:string = "";
    public MessageType:MessageTypes = MessageTypes.RegularText;
    public IsFromMe:boolean = false;    
    public User:UserModel = new UserModel();
    public SentTime:number = 0;

    public followingMessages:MessageModel[] = [];

    public data:any[] = [];

    constructor(message:string, messageType:MessageTypes, user:UserModel){
        message = message || "";
        if (message.length <= 0){
            throw new Error("Message must not empty")
        }

        this.Message = message;

        messageType = messageType || MessageTypes.RegularText;
        this.MessageType = messageType;

        this.User = user;

        this.SentTime = moment(new Date()).unix();
    }
}
