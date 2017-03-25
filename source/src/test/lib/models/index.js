"use strict";
const moment = require('moment');
const chai_1 = require('chai');
const Rx = require('rxjs/Rx');
const RiveScript = require("rivescript");
const BrainFiles = [
    "assets/brain/greetings.rive"
];
/**
 * Please dont use 0 as the value
 */
(function (MessageTypes) {
    MessageTypes[MessageTypes["RegularText"] = 1] = "RegularText";
    MessageTypes[MessageTypes["Typings"] = 2] = "Typings";
})(exports.MessageTypes || (exports.MessageTypes = {}));
var MessageTypes = exports.MessageTypes;
class MessageModel {
    constructor(message, messageType, user) {
        this.Message = "";
        this.MessageType = MessageTypes.RegularText;
        this.IsFromMe = false;
        this.User = new UserModel();
        this.SentTime = 0;
        message = message || "";
        if (message.length <= 0) {
            throw new Error("Message must not empty");
        }
        this.Message = message;
        messageType = messageType || MessageTypes.RegularText;
        this.MessageType = messageType;
        this.User = user;
        this.SentTime = moment(new Date()).valueOf();
    }
}
exports.MessageModel = MessageModel;
class UserModel {
    constructor() {
        this.PicUrl = "";
        this.Username = "";
    }
}
exports.UserModel = UserModel;
class GofoodBot {
    constructor(userRetriever) {
        this.userRetriever = userRetriever;
        this.botScript = new RiveScript();
        chai_1.assert.isNotNull(this.userRetriever, "userRetriever must not null");
    }
    _initBotBrain() {
        return Rx.Observable.create(s => {
            this.botScript.loadFile(BrainFiles, function (batch_num) {
                console.log('All brain files, loaded');
                this.botScript.sortReplies();
                s.next();
                s.complete();
            }, function (err) {
                s.error(err);
            });
        });
    }
    init() {
        return Rx.Observable.from([""])
            .flatMap(() => this._initBotBrain());
    }
    getTypingsMessage() {
        return this.userRetriever.getUser()
            .flatMap((user) => {
            return this.getBotUser()
                .map((botUser) => {
                return {
                    user,
                    botUser
                };
            });
        })
            .map((combined) => {
            let message = new MessageModel(`Typings...`, MessageTypes.Typings, combined.botUser);
            return message;
        });
    }
    sayGreetings() {
        return this.userRetriever.getUser()
            .flatMap((user) => {
            return this.getBotUser()
                .map((botUser) => {
                return {
                    user,
                    botUser
                };
            });
        })
            .map((combined) => {
            let message = new MessageModel(`Halo ${combined.user.Username}! Kamu mau langsung pesan atau lihat menu?`, MessageTypes.RegularText, combined.user);
            message.User = combined.botUser;
            return message;
        });
    }
    getReply(userMessage) {
        let reply = this.botScript.reply("local-user", userMessage.Message);
        return this.getBotUser()
            .map((botUser) => {
            let replyModel = new MessageModel(reply, MessageTypes.RegularText, botUser);
            return replyModel;
        });
    }
    getBotUser() {
        let user = new UserModel();
        user.PicUrl = "https://mustafit.files.wordpress.com/2017/01/gofood.jpg";
        user.Username = "Go-food Bot";
        return Rx.Observable.from([user]);
    }
    static Create() {
        return new GofoodBot(new DummyCurrentUserRetriever());
    }
}
exports.GofoodBot = GofoodBot;
class DummyCurrentUserRetriever {
    getUser() {
        let user = new UserModel();
        // user.PicUrl = "https://avatars3.githubusercontent.com/u/393533?v=3&u=cb9508c2c45ea4a8677c2f99a6de73c015bf8db0&s=400";
        user.PicUrl = "https://scontent-sit4-1.xx.fbcdn.net/v/t1.0-1/64767_10202758933813512_4581591136467101320_n.jpg?oh=7ae3806f479536b2b8b9a894c08170c9&oe=59553B50";
        user.Username = "Norma";
        return Rx.Observable.from([user]);
    }
}
exports.DummyCurrentUserRetriever = DummyCurrentUserRetriever;
