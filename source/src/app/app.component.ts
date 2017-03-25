import { Component } from '@angular/core';
import {MessageModel, UserModel, MessageTypes, GofoodBot, IUserRetriever, DummyCurrentUserRetriever} from '../models';
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

  ngOnInit(){

    return this.getCurrentUserRetriever().getUser()
            .map((currentUser:UserModel) => {
              this.currentUser = currentUser;
            })
            .flatMap(() => this.bot.getTypingsMessage())    
            .map((typingsMessage:MessageModel) =>{
              let messageIndex = this.Messages.push(typingsMessage);

              return messageIndex -1;
            })
            .delay(3000)            
            .flatMap((typingsMessageIndex:number) =>{
              return this.bot
                      .init()
                      .concatMap(() => this.bot.sayGreetings()) 
                      .map((typingsMessage:MessageModel) =>{
                        this.Messages[typingsMessageIndex] = typingsMessage;
                      })

            })
            .toPromise();

  }


  isRegularText(message:MessageModel){
    return message.MessageType === MessageTypes.RegularText;
  }

  getMessageTime(message:MessageModel){
    if(message){
      return moment.unix(message.SentTime).format("LLL")
    }
  }

  isRegularMessage(message:MessageModel){
    return message.MessageType === MessageTypes.RegularText
  }

  sendMessage(){

    let userMessage:MessageModel = new MessageModel(this.currentMessage, MessageTypes.RegularText, this.currentUser);
    this.Messages.push(userMessage);
    this.currentMessage = "";

    return this.bot       
            .getTypingsMessage()     
            .map((typingsMessage:MessageModel) =>{
              let messageIndex = this.Messages.push(typingsMessage);

              return messageIndex -1;
            })
            .delay(3000)            
            .flatMap((messageIndex:number) => this.bot.getReply(userMessage).map((replyMessage:MessageModel) => {
              return {
                messageIndex,
                replyMessage
              }
            }))
            .map((combined:any) => {
              this.Messages[combined.messageIndex] = combined.replyMessage;
            })
            .toPromise()
  }
}
