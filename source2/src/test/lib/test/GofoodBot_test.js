"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const chai_1 = require("chai");
const Rx = require("rxjs/Rx");
describe("GofoodBot", function () {
    describe('sayGreetings()', function () {
        it('return the corrects greetings message', function () {
            return __awaiter(this, void 0, void 0, function* () {
                let bot = models_1.GofoodBot.Create();
                let greetings = yield bot.sayGreetings().toPromise();
                chai_1.assert.equal(greetings.Message, "Halo Norma! Kamu mau langsung pesan atau lihat menu dulu?");
                chai_1.assert.equal(greetings.MessageType, models_1.MessageTypes.RegularText);
                chai_1.assert.equal(greetings.User.PicUrl, "https://mustafit.files.wordpress.com/2017/01/gofood.jpg");
                chai_1.assert.equal(greetings.User.Username, "Go-food Bot");
            });
        });
    });
    describe('getTypingsMessage()', function () {
        it('return the corrects typings message', function () {
            return __awaiter(this, void 0, void 0, function* () {
                let bot = models_1.GofoodBot.Create();
                let greetings = yield bot.getTypingsMessage().toPromise();
                chai_1.assert.equal(greetings.Message, "Typings...");
                chai_1.assert.equal(greetings.MessageType, models_1.MessageTypes.Typings);
                chai_1.assert.equal(greetings.User.PicUrl, "https://mustafit.files.wordpress.com/2017/01/gofood.jpg");
                chai_1.assert.equal(greetings.User.Username, "Go-food Bot");
            });
        });
    });
    describe('mapBotReplyToMessageModel()', function () {
        it('maps OK! Ini menunya: with SHOW_DISHES_TYPES command', function () {
            return __awaiter(this, void 0, void 0, function* () {
                let bot = models_1.GofoodBot.Create();
                let replyMessageModel = yield bot.mapBotReplyToMessageModel("OK! Ini menunya:", new models_1.UserModel()).toPromise();
                chai_1.assert.equal(replyMessageModel.Message, "OK! Ini menunya:");
                chai_1.assert.equal(replyMessageModel.MessageType, models_1.MessageTypes.RegularText);
                chai_1.assert.equal(replyMessageModel.followingMessages.length, 1);
                chai_1.assert.equal(replyMessageModel.followingMessages[0].Message, "SHOW_DISHES_TYPES");
            });
        });
        it('maps Baiklah! Ini menu yang kita punya: with SHOW_DISHES_TYPES command', function () {
            return __awaiter(this, void 0, void 0, function* () {
                let bot = models_1.GofoodBot.Create();
                let replyMessageModel = yield bot.mapBotReplyToMessageModel("Baiklah! Ini menu yang kita punya:", new models_1.UserModel()).toPromise();
                chai_1.assert.equal(replyMessageModel.Message, "Baiklah! Ini menu yang kita punya:");
                chai_1.assert.equal(replyMessageModel.MessageType, models_1.MessageTypes.RegularText);
                chai_1.assert.equal(replyMessageModel.followingMessages.length, 1);
                chai_1.assert.equal(replyMessageModel.followingMessages[0].Message, "SHOW_DISHES_TYPES");
            });
        });
        it('maps Ini list menu bakso with SHOW_FOOD_MENU command', function () {
            return __awaiter(this, void 0, void 0, function* () {
                let bot = models_1.GofoodBot.Create();
                bot.menuQueryExecutor = {
                    query(queryText) {
                        let foodMenu = new models_1.FoodMenuModel("Bubur", "", 10000, null);
                        return Rx.Observable.from([[foodMenu]]);
                    }
                };
                let replyMessageModel = yield bot.mapBotReplyToMessageModel("Ini list menu bakso", new models_1.UserModel()).toPromise();
                chai_1.assert.equal(replyMessageModel.Message, `Ini menu bakso`);
                chai_1.assert.equal(replyMessageModel.MessageType, models_1.MessageTypes.RegularText);
                chai_1.assert.equal(replyMessageModel.followingMessages.length, 1, "followingMessages.length");
                chai_1.assert.equal(replyMessageModel.followingMessages[0].Message, "SHOW_FOOD_MENU", "followingMessages[0].Message");
            });
        });
        it('maps Ini menu bakso with SHOW_FOOD_MENU command', function () {
            return __awaiter(this, void 0, void 0, function* () {
                let bot = models_1.GofoodBot.Create();
                bot.menuQueryExecutor = {
                    query(queryText) {
                        let foodMenu = new models_1.FoodMenuModel("Bubur", "", 10000, null);
                        return Rx.Observable.from([[foodMenu]]);
                    }
                };
                let replyMessageModel = yield bot.mapBotReplyToMessageModel("Ini menu bakso", new models_1.UserModel()).toPromise();
                chai_1.assert.equal(replyMessageModel.Message, `Ini menu bakso`);
                chai_1.assert.equal(replyMessageModel.MessageType, models_1.MessageTypes.RegularText);
                chai_1.assert.equal(replyMessageModel.followingMessages.length, 1, "followingMessages.length");
                chai_1.assert.equal(replyMessageModel.followingMessages[0].Message, "SHOW_FOOD_MENU", "followingMessages[0].Message");
            });
        });
        it('maps Ini daftar bakso with SHOW_FOOD_MENU command', function () {
            return __awaiter(this, void 0, void 0, function* () {
                let bot = models_1.GofoodBot.Create();
                bot.menuQueryExecutor = {
                    query(queryText) {
                        let foodMenu = new models_1.FoodMenuModel("Bubur", "", 10000, null);
                        return Rx.Observable.from([[foodMenu]]);
                    }
                };
                let replyMessageModel = yield bot.mapBotReplyToMessageModel("Ini daftar bakso", new models_1.UserModel()).toPromise();
                chai_1.assert.equal(replyMessageModel.Message, `Ini daftar bakso`);
                chai_1.assert.equal(replyMessageModel.MessageType, models_1.MessageTypes.RegularText);
                chai_1.assert.equal(replyMessageModel.followingMessages.length, 1, "followingMessages.length");
                chai_1.assert.equal(replyMessageModel.followingMessages[0].Message, "SHOW_FOOD_MENU", "followingMessages[0].Message");
            });
        });
    });
});
