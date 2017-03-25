import { Component, ViewChild } from '@angular/core';
import {MessageModel, DishesTypeModel, UserModel, MessageTypes, GofoodBot, IUserRetriever, DummyCurrentUserRetriever} from '../models';
import * as moment from 'moment';
import * as Rx from 'rxjs/Rx';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  public Messages:MessageModel[] = [];
  public currentMessage:string = "";
  protected bot:GofoodBot = GofoodBot.Create();

  protected currentUser:UserModel = null;


  protected getCurrentUserRetriever():IUserRetriever{
    return new DummyCurrentUserRetriever();
  }

  messageTypeRegularText(){
    return MessageTypes.RegularText
  }

  messageTypeShowMenu(){
    return MessageTypes.ShowMenu
  }


  ngOnInit(){

    return Rx.Observable.from([""], Rx.Scheduler.animationFrame) 
            .flatMap(() => this.getCurrentUserRetriever().getUser())
            .map((currentUser:UserModel) => {
              this.currentUser = currentUser;
            })
            .flatMap(() => this.bot.getTypingsMessage())    
            .map((typingsMessage:MessageModel) =>{
              
              return this.pushMessage(typingsMessage);

            })
            .delay(3000)            
            .flatMap((typingsMessageIndex:number) =>{
              return this.bot
                      .init()
                      .concatMap(() => this.bot.sayGreetings()) 
                      .map((greetingsMessage:MessageModel) =>{
                        this.replaceMessage(typingsMessageIndex, greetingsMessage);
                      })

            })
            .toPromise();

  }

  /**
   * Push a new message and return the message index 
   * @param message The message
   */
  pushMessage(message:MessageModel):number{
    let messageIndex = this.Messages.push(message);

    return messageIndex - 1;
  }

  replaceMessage(messageIndex:number, newMessage:MessageModel){
    this.Messages[messageIndex] = newMessage;
  }

  isRegularText(message:MessageModel){
    return message.MessageType === MessageTypes.RegularText;
  }

  getMessageTime(message:MessageModel){
    if(message){
      return moment.unix(message.SentTime).format("LLL")
    }
  }

  doShowChildDishes(dishesType:DishesTypeModel){

    this.currentMessage = `lihat menu ${dishesType.Name}`

    this.sendMessage();

  }

  isShowMenuMessage(message:MessageModel){
    return message != null && message.Message === "SHOW_DISHES_TYPES";
  }

  isRegularTextMessage(message:MessageModel){
    return message != null && message.MessageType === MessageTypes.RegularText;
  }

  isTypingsMessage(message:MessageModel){
    return message != null && message.MessageType === MessageTypes.Typings;
  }

  isRegularMessage(message:MessageModel){
    return message.MessageType === MessageTypes.RegularText
  }

  interpretMessageCommand(message:MessageModel){
    if(message.MessageType === MessageTypes.Command && message.Message === "SHOW_DISHES_TYPES"){
      message.MessageType = MessageTypes.ShowMenu;
      this.pushMessage(message);
    }
  }

  sendMessage(){

    let userMessage:MessageModel = new MessageModel(this.currentMessage, MessageTypes.RegularText, this.currentUser);
    this.pushMessage(userMessage);
    this.currentMessage = "";

    return this.bot                   
            .getTypingsMessage()     
            .delay(2000)
            .map((typingsMessage:MessageModel) =>{
              return this.pushMessage(typingsMessage);
            })
            .delay(3000)            
            .flatMap((messageIndex:number) => this.bot.getReply(userMessage).map((replyMessage:MessageModel) => {
              return {
                messageIndex,
                replyMessage
              }
            }))
            .map((combined:any) => {
              this.replaceMessage(combined.messageIndex, combined.replyMessage)

              let followingMessages:MessageModel[] = combined.replyMessage.followingMessages;

              followingMessages.forEach((followingMessage:MessageModel) => {
                  this.pushMessage(followingMessage);
              })

            })
            .toPromise()
  }
}
