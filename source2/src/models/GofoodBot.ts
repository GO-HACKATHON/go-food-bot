import * as moment from 'moment';
import {assert} from 'chai';

import {IUserRetriever} from './IUserRetriever';
import {MessageModel} from './MessageModel';
import {UserModel} from "./UserModel";
import {MessageTypes} from "./MessageTypes";
import {DishesTypeModel} from "./DishesTypeModel";
import {DummyCurrentUserRetriever} from "./DummyCurrentUserRetriever";
import {FoodMenuModel} from "./FoodMenuModel";

import {IMenuQueryExecutor} from "./IMenuQueryExecutor";
import {FuzzyMenuQueryExecutor} from "./FuzzyMenuQueryExecutor";

import * as Rx from 'rxjs/Rx';
import {IDishesTypeRetriever, DummyDishesTypeRetriever} from '../services';

declare let require:any;

const RiveScript = require("rivescript");

const BrainFiles = [
    "assets/brain/begin.rive",
    "assets/brain/greetings.rive",
    "assets/brain/menu.rive",
    "assets/brain/free-ongkir.rive",
    "assets/brain/pesan.rive"
]

export class GofoodBot{

    protected botScript:any = new RiveScript();

    protected dishesTypes:DishesTypeModel[] = [];

    constructor(private userRetriever:IUserRetriever, 
        private dishesTypeRetriever: IDishesTypeRetriever,
        private menuQueryExecutor:IMenuQueryExecutor){

        assert.isNotNull(this.userRetriever, "userRetriever must not null");

    }

    _initBotBrain():Rx.Observable<void>{
        return Rx.Observable.create(s =>{
            this.botScript.loadFile(BrainFiles, (batch_num) =>{
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
                    let message:MessageModel = new MessageModel(`Halo ${combined.user.Username}! Kamu mau langsung pesan atau lihat menu dulu?`, MessageTypes.RegularText, combined.user);
                    message.User = combined.botUser;

                    return message;
                })
        
    }

    protected mapToSHOW_DISHES_TYPES(botReply:string, botUser:UserModel, subscriber:any){
        let replyModel = new MessageModel(botReply, MessageTypes.RegularText, botUser);
        

        let commandMessage:MessageModel = new MessageModel("SHOW_DISHES_TYPES", MessageTypes.Command, botUser);
        replyModel.followingMessages.push(commandMessage);

        this.dishesTypeRetriever.getDishesTypes()
                .map((dishesTypesData:DishesTypeModel[]) => {
                    this.dishesTypes = dishesTypesData;
                    commandMessage.data = dishesTypesData;

                    return commandMessage;
                })
                .subscribe(() => {
                    subscriber.next(replyModel);
                    subscriber.complete();                                
                })        
    }

    protected mapToSHOW_FOOD_MENU(prefixPattern:string, botReply:string, botUser:UserModel, subscriber:any, replyPrefix:string = "Ini menu"){
        let queryText:string = botReply.substr(prefixPattern.length).trim();
        let replyModel = new MessageModel(botReply, MessageTypes.RegularText, botUser);


        this.menuQueryExecutor.query(queryText)
            .map((results:FoodMenuModel[]) => {
                if(results.length > 0){
                    replyModel.Message = `${replyPrefix} ${queryText}`;

                    let commandMessage:MessageModel = new MessageModel("SHOW_FOOD_MENU", MessageTypes.Command, botUser);
                    commandMessage.data = results;
                    replyModel.followingMessages.push(commandMessage);
                }
                else{
                    replyModel.Message = `Ma'af saya belum punya data ${queryText}`;
                }
            })
            .subscribe(() => {
                subscriber.next(replyModel);
                subscriber.complete();                                
            })
    }

    protected mapBotReplyToMessageModel(botReply:string, botUser:UserModel):Rx.Observable<MessageModel>{

        let replyObservable:Rx.Observable<MessageModel> = Rx.Observable.create(s => {

            try {
                let replyModel:MessageModel = null;

                if(botReply.startsWith("OK! Ini menunya:") || botReply.startsWith("Baiklah! Ini menu yang kita punya:")){
                    this.mapToSHOW_DISHES_TYPES(botReply, botUser, s);
                }
                else if(botReply.startsWith("Ini list menu")){
                    this.mapToSHOW_FOOD_MENU("Ini list menu", botReply, botUser, s);
                }                                
                else if(botReply.startsWith("Ini menu")){
                    this.mapToSHOW_FOOD_MENU("Ini menu", botReply, botUser, s);                    
                }
                else if(botReply.startsWith("Ini daftar")){                    
                    this.mapToSHOW_FOOD_MENU("Ini daftar", botReply, botUser, s, "Ini daftar");                         
                }
                else if(botReply.startsWith("Maaf saya tidak mengerti")){
                    let queryText:string = botReply.substr("Maaf saya tidak mengerti".length);
                    replyModel = new MessageModel(botReply, MessageTypes.RegularText, botUser);


                    this.menuQueryExecutor.query(queryText)
                        .map((results:FoodMenuModel[]) => {

                            if(results.length > 0){
                                replyModel.Message = `Ini menu ${queryText}`;

                                let commandMessage:MessageModel = new MessageModel("SHOW_FOOD_MENU", MessageTypes.Command, botUser);
                                commandMessage.data = results;

                                replyModel.followingMessages.push(commandMessage);
                            }
                            else{
                                replyModel.Message = `Ma'af saya belum punya data ${queryText}`;
                            }

                                                                                    
                        })
                        .subscribe(() => {
                            s.next(replyModel);
                            s.complete();                                
                        })
                    
                }
                else{
                    replyModel = new MessageModel(botReply, MessageTypes.RegularText, botUser);

                    s.next(replyModel);
                    s.complete();
                }

                
            } catch (error) {
                s.error(error);                
            }
        })        

        return replyObservable;
    }

    public getReply(userMessage:MessageModel):Rx.Observable<MessageModel>{
        
        let reply:string = this.botScript.reply("local-user", userMessage.Message);

        return this.getBotUser()
                .flatMap((botUser:UserModel) => {

                    return this.mapBotReplyToMessageModel(reply, botUser);
                })
    }

    public getBotUser():Rx.Observable<UserModel>{
        let user:UserModel = new UserModel();
        user.PicUrl = "https://mustafit.files.wordpress.com/2017/01/gofood.jpg";
        user.Username = "Go-food Bot";

        return Rx.Observable.from([user]);
    }

    public static Create():GofoodBot{
        return new GofoodBot(new DummyCurrentUserRetriever(), new DummyDishesTypeRetriever(), 
            new FuzzyMenuQueryExecutor())
    }
}