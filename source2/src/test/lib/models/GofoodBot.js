"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const MessageModel_1 = require("./MessageModel");
const UserModel_1 = require("./UserModel");
const MessageTypes_1 = require("./MessageTypes");
const DummyCurrentUserRetriever_1 = require("./DummyCurrentUserRetriever");
const FuzzyMenuQueryExecutor_1 = require("./FuzzyMenuQueryExecutor");
const Rx = require("rxjs/Rx");
const services_1 = require("../services");
const RiveScript = require("rivescript");
const BrainFiles = [
    "assets/brain/begin.rive",
    "assets/brain/greetings.rive",
    "assets/brain/menu.rive",
    "assets/brain/free-ongkir.rive",
    "assets/brain/pesan.rive"
];
class GofoodBot {
    constructor(userRetriever, dishesTypeRetriever, menuQueryExecutor) {
        this.userRetriever = userRetriever;
        this.dishesTypeRetriever = dishesTypeRetriever;
        this.menuQueryExecutor = menuQueryExecutor;
        this.botScript = new RiveScript();
        this.dishesTypes = [];
        chai_1.assert.isNotNull(this.userRetriever, "userRetriever must not null");
    }
    _initBotBrain() {
        return Rx.Observable.create(s => {
            this.botScript.loadFile(BrainFiles, (batch_num) => {
                this.botScript.sortReplies();
                s.next();
                s.complete();
            }, (err) => {
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
            let message = new MessageModel_1.MessageModel(`Typings...`, MessageTypes_1.MessageTypes.Typings, combined.botUser);
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
            let message = new MessageModel_1.MessageModel(`Halo ${combined.user.Username}! Kamu mau langsung pesan atau lihat menu dulu?`, MessageTypes_1.MessageTypes.RegularText, combined.user);
            message.User = combined.botUser;
            return message;
        });
    }
    mapBotReplyToMessageModel(botReply, botUser) {
        let replyObservable = Rx.Observable.create(s => {
            try {
                let replyModel = null;
                if (botReply.startsWith("OK! Ini menunya:") || botReply.startsWith("Baiklah! Ini menu yang kita punya:")) {
                    replyModel = new MessageModel_1.MessageModel(botReply, MessageTypes_1.MessageTypes.RegularText, botUser);
                    let commandMessage = new MessageModel_1.MessageModel("SHOW_DISHES_TYPES", MessageTypes_1.MessageTypes.Command, botUser);
                    replyModel.followingMessages.push(commandMessage);
                    this.dishesTypeRetriever.getDishesTypes()
                        .map((dishesTypesData) => {
                        this.dishesTypes = dishesTypesData;
                        commandMessage.data = dishesTypesData;
                        return commandMessage;
                    })
                        .subscribe(() => {
                        s.next(replyModel);
                        s.complete();
                    });
                }
                else if (botReply.startsWith("Ini list menu")) {
                    let queryText = botReply.substr("Ini list menu".length).trim();
                    replyModel = new MessageModel_1.MessageModel(botReply, MessageTypes_1.MessageTypes.RegularText, botUser);
                    this.menuQueryExecutor.query(queryText)
                        .map((results) => {
                        if (results.length > 0) {
                            replyModel.Message = `Ini menu ${queryText}`;
                            let commandMessage = new MessageModel_1.MessageModel("SHOW_FOOD_MENU", MessageTypes_1.MessageTypes.Command, botUser);
                            commandMessage.data = results;
                            replyModel.followingMessages.push(commandMessage);
                        }
                        else {
                            replyModel.Message = `Ma'af saya belum punya data ${queryText}`;
                        }
                    })
                        .subscribe(() => {
                        s.next(replyModel);
                        s.complete();
                    });
                }
                else if (botReply.startsWith("Ini menu")) {
                    let queryText = botReply.substr("Ini menu".length);
                    replyModel = new MessageModel_1.MessageModel(botReply, MessageTypes_1.MessageTypes.RegularText, botUser);
                    this.menuQueryExecutor.query(queryText)
                        .map((results) => {
                        if (results.length > 0) {
                            replyModel.Message = `Ini menu ${queryText}`;
                            let commandMessage = new MessageModel_1.MessageModel("SHOW_FOOD_MENU", MessageTypes_1.MessageTypes.Command, botUser);
                            commandMessage.data = results;
                            replyModel.followingMessages.push(commandMessage);
                        }
                        else {
                            replyModel.Message = `Ma'af saya belum punya data ${queryText}`;
                        }
                    })
                        .subscribe(() => {
                        s.next(replyModel);
                        s.complete();
                    });
                }
                else if (botReply.startsWith("Ini daftar")) {
                    let queryText = botReply.substr("Ini daftar".length);
                    replyModel = new MessageModel_1.MessageModel(botReply, MessageTypes_1.MessageTypes.RegularText, botUser);
                    this.menuQueryExecutor.query(queryText)
                        .map((results) => {
                        if (results.length > 0) {
                            replyModel.Message = `Ini daftar ${queryText}`;
                            let commandMessage = new MessageModel_1.MessageModel("SHOW_FOOD_MENU", MessageTypes_1.MessageTypes.Command, botUser);
                            commandMessage.data = results;
                            replyModel.followingMessages.push(commandMessage);
                        }
                        else {
                            replyModel.Message = `Ma'af saya belum punya data ${queryText}`;
                        }
                    })
                        .subscribe(() => {
                        s.next(replyModel);
                        s.complete();
                    });
                }
                else if (botReply.startsWith("Maaf saya tidak mengerti")) {
                    let queryText = botReply.substr("Maaf saya tidak mengerti".length);
                    replyModel = new MessageModel_1.MessageModel(botReply, MessageTypes_1.MessageTypes.RegularText, botUser);
                    this.menuQueryExecutor.query(queryText)
                        .map((results) => {
                        if (results.length > 0) {
                            replyModel.Message = `Ini menu ${queryText}`;
                            let commandMessage = new MessageModel_1.MessageModel("SHOW_FOOD_MENU", MessageTypes_1.MessageTypes.Command, botUser);
                            commandMessage.data = results;
                            replyModel.followingMessages.push(commandMessage);
                        }
                        else {
                            replyModel.Message = `Ma'af saya belum punya data ${queryText}`;
                        }
                    })
                        .subscribe(() => {
                        s.next(replyModel);
                        s.complete();
                    });
                }
                else {
                    replyModel = new MessageModel_1.MessageModel(botReply, MessageTypes_1.MessageTypes.RegularText, botUser);
                    s.next(replyModel);
                    s.complete();
                }
            }
            catch (error) {
                s.error(error);
            }
        });
        return replyObservable;
    }
    getReply(userMessage) {
        let reply = this.botScript.reply("local-user", userMessage.Message);
        return this.getBotUser()
            .flatMap((botUser) => {
            return this.mapBotReplyToMessageModel(reply, botUser);
        });
    }
    getBotUser() {
        let user = new UserModel_1.UserModel();
        user.PicUrl = "https://mustafit.files.wordpress.com/2017/01/gofood.jpg";
        user.Username = "Go-food Bot";
        return Rx.Observable.from([user]);
    }
    static Create() {
        return new GofoodBot(new DummyCurrentUserRetriever_1.DummyCurrentUserRetriever(), new services_1.DummyDishesTypeRetriever(), new FuzzyMenuQueryExecutor_1.FuzzyMenuQueryExecutor());
    }
}
exports.GofoodBot = GofoodBot;
