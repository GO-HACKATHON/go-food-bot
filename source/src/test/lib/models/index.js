"use strict";
const moment = require('moment');
const chai_1 = require('chai');
const Rx = require('rxjs/Rx');
const RiveScript = require("rivescript");
/**
 * Please dont use 0 as the value
 */
(function (MessageTypes) {
    MessageTypes[MessageTypes["RegularText"] = 1] = "RegularText";
})(exports.MessageTypes || (exports.MessageTypes = {}));
var MessageTypes = exports.MessageTypes;
class MessageModel {
    constructor(message, messageType) {
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
        chai_1.assert.isNotNull(this.userRetriever, "userRetriever must not null");
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
            let message = new MessageModel(`Halo ${combined.user.Username}! Kamu mau langsung pesan atau lihat menu?`, MessageTypes.RegularText);
            message.User = combined.botUser;
            return message;
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
        user.PicUrl = "https://avatars3.githubusercontent.com/u/393533?v=3&u=cb9508c2c45ea4a8677c2f99a6de73c015bf8db0&s=400";
        user.Username = "Irwansyah";
        return Rx.Observable.from([user]);
    }
}
exports.DummyCurrentUserRetriever = DummyCurrentUserRetriever;
