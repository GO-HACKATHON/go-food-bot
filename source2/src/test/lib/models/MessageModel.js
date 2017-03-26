"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const MessageTypes_1 = require("./MessageTypes");
const UserModel_1 = require("./UserModel");
class MessageModel {
    constructor(message, messageType, user) {
        this.Message = "";
        this.MessageType = MessageTypes_1.MessageTypes.RegularText;
        this.IsFromMe = false;
        this.User = new UserModel_1.UserModel();
        this.SentTime = 0;
        this.followingMessages = [];
        this.data = [];
        message = message || "";
        if (message.length <= 0) {
            throw new Error("Message must not empty");
        }
        this.Message = message;
        messageType = messageType || MessageTypes_1.MessageTypes.RegularText;
        this.MessageType = messageType;
        this.User = user;
        this.SentTime = moment(new Date()).unix();
    }
}
exports.MessageModel = MessageModel;
