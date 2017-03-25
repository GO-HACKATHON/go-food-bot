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
    "assets/brain/greetings.rive",
    "assets/brain/menu.rive",
    "assets/brain/free-ongkir.rive"
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
                    let message:MessageModel = new MessageModel(`Halo ${combined.user.Username}! Kamu mau langsung pesan atau lihat menu dulu?`, MessageTypes.RegularText, combined.user);
                    message.User = combined.botUser;

                    return message;
                })
        
    }

    protected mapBotReplyToMessageModel(botReply:string, botUser:UserModel):Rx.Observable<MessageModel>{

        let replyObservable:Rx.Observable<MessageModel> = Rx.Observable.create(s => {

            try {
                let replyModel:MessageModel = null;

                if(botReply.startsWith("OK! Ini menunya:") || botReply.startsWith("Baiklah! Ini menu yang kita punya:")){
                    replyModel = new MessageModel(botReply, MessageTypes.RegularText, botUser);
                    

                    let commandMessage:MessageModel = new MessageModel("SHOW_DISHES_TYPES", MessageTypes.Command, botUser);
                    replyModel.followingMessages.push(commandMessage);

                    this.dishesTypeRetriever.getDishesTypes()
                            .map((dishesTypesData:DishesTypeModel[]) => {
                                this.dishesTypes = dishesTypesData;
                                commandMessage.data = dishesTypesData;

                                return commandMessage;
                            })
                            .subscribe(() => {
                                s.next(replyModel);
                                s.complete();                                
                            })
                    

                }
                else if(botReply.startsWith("Ini menu")){
                    let queryText:string = botReply.substr("Ini menu".length);
                    replyModel = new MessageModel(botReply, MessageTypes.RegularText, botUser);


                    this.menuQueryExecutor.query(queryText)
                        .map((results:FoodMenuModel[]) => {
                            let commandMessage:MessageModel = new MessageModel("SHOW_FOOD_MENU", MessageTypes.Command, botUser);
                            commandMessage.data = results;
                            replyModel.followingMessages.push(commandMessage);
                            
                            console.log("results:", results);
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