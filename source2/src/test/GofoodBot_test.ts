

import {MessageModel, MessageTypes, UserModel, GofoodBot, FoodMenuModel} from '../models';

import {assert} from 'chai';
import * as moment from 'moment';
import * as Rx from 'rxjs/Rx';

declare let describe:any;
declare let it:any;

describe("GofoodBot", function(){
    describe('sayGreetings()', function(){
        it('return the corrects greetings message', async function(){
            let bot:GofoodBot = GofoodBot.Create();

            let  greetings:MessageModel =  await bot.sayGreetings().toPromise();

            assert.equal(greetings.Message, "Halo Norma! Kamu mau langsung pesan atau lihat menu dulu?")
            assert.equal(greetings.MessageType, MessageTypes.RegularText)
            assert.equal(greetings.User.PicUrl, "https://mustafit.files.wordpress.com/2017/01/gofood.jpg")
            assert.equal(greetings.User.Username, "Go-food Bot")
        })
    })

    describe('getTypingsMessage()', function(){
        it('return the corrects typings message', async function(){
            let bot:GofoodBot = GofoodBot.Create();

            let  greetings:MessageModel =  await bot.getTypingsMessage().toPromise();

            assert.equal(greetings.Message, "Typings...");
            assert.equal(greetings.MessageType, MessageTypes.Typings);
            assert.equal(greetings.User.PicUrl, "https://mustafit.files.wordpress.com/2017/01/gofood.jpg")
            assert.equal(greetings.User.Username, "Go-food Bot")
        })
    })

    describe('mapBotReplyToMessageModel()', function(){
        it('maps OK! Ini menunya: with SHOW_DISHES_TYPES command', async function(){
            let bot:GofoodBot = GofoodBot.Create();

            let  replyMessageModel:MessageModel =  await (bot as any).mapBotReplyToMessageModel("OK! Ini menunya:", new UserModel()).toPromise();

            assert.equal(replyMessageModel.Message,"OK! Ini menunya:");
            assert.equal(replyMessageModel.MessageType, MessageTypes.RegularText);
            assert.equal(replyMessageModel.followingMessages.length, 1);
            assert.equal(replyMessageModel.followingMessages[0].Message, "SHOW_DISHES_TYPES");
        })

        it('maps Baiklah! Ini menu yang kita punya: with SHOW_DISHES_TYPES command', async function(){
            let bot:GofoodBot = GofoodBot.Create();

            let  replyMessageModel:MessageModel =  await (bot as any).mapBotReplyToMessageModel("Baiklah! Ini menu yang kita punya:", new UserModel()).toPromise();

            assert.equal(replyMessageModel.Message,"Baiklah! Ini menu yang kita punya:");
            assert.equal(replyMessageModel.MessageType, MessageTypes.RegularText);
            assert.equal(replyMessageModel.followingMessages.length, 1);
            assert.equal(replyMessageModel.followingMessages[0].Message, "SHOW_DISHES_TYPES");
        })

        it('maps Ini list menu bakso with SHOW_FOOD_MENU command', async function(){
            let bot:GofoodBot = GofoodBot.Create();

            (bot as any).menuQueryExecutor = {
                query(queryText):Rx.Observable<FoodMenuModel[]>{
                    let foodMenu:FoodMenuModel = new FoodMenuModel("Bubur", "", 10000, null);

                    return Rx.Observable.from([[foodMenu]]);
                }
            }

            let  replyMessageModel:MessageModel =  await (bot as any).mapBotReplyToMessageModel("Ini list menu bakso", new UserModel()).toPromise();

            assert.equal(replyMessageModel.Message,`Ini menu bakso`);
            assert.equal(replyMessageModel.MessageType, MessageTypes.RegularText);
            assert.equal(replyMessageModel.followingMessages.length, 1, "followingMessages.length");
            assert.equal(replyMessageModel.followingMessages[0].Message, "SHOW_FOOD_MENU", "followingMessages[0].Message");
        })

        it('maps Ini menu bakso with SHOW_FOOD_MENU command', async function(){
            let bot:GofoodBot = GofoodBot.Create();

            (bot as any).menuQueryExecutor = {
                query(queryText):Rx.Observable<FoodMenuModel[]>{
                    let foodMenu:FoodMenuModel = new FoodMenuModel("Bubur", "", 10000, null);

                    return Rx.Observable.from([[foodMenu]]);
                }
            }

            let  replyMessageModel:MessageModel =  await (bot as any).mapBotReplyToMessageModel("Ini menu bakso", new UserModel()).toPromise();

            assert.equal(replyMessageModel.Message,`Ini menu bakso`);
            assert.equal(replyMessageModel.MessageType, MessageTypes.RegularText);
            assert.equal(replyMessageModel.followingMessages.length, 1, "followingMessages.length");
            assert.equal(replyMessageModel.followingMessages[0].Message, "SHOW_FOOD_MENU", "followingMessages[0].Message");
        })

        it('maps Ini daftar bakso with SHOW_FOOD_MENU command', async function(){
            let bot:GofoodBot = GofoodBot.Create();

            (bot as any).menuQueryExecutor = {
                query(queryText):Rx.Observable<FoodMenuModel[]>{
                    let foodMenu:FoodMenuModel = new FoodMenuModel("Bubur", "", 10000, null);

                    return Rx.Observable.from([[foodMenu]]);
                }
            }

            let  replyMessageModel:MessageModel =  await (bot as any).mapBotReplyToMessageModel("Ini daftar bakso", new UserModel()).toPromise();

            assert.equal(replyMessageModel.Message,`Ini daftar bakso`);
            assert.equal(replyMessageModel.MessageType, MessageTypes.RegularText);
            assert.equal(replyMessageModel.followingMessages.length, 1, "followingMessages.length");
            assert.equal(replyMessageModel.followingMessages[0].Message, "SHOW_FOOD_MENU", "followingMessages[0].Message");
        })
        
    })
    
});