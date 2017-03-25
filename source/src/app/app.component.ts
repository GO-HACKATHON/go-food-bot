import { Component } from '@angular/core';
import {MessageModel, UserModel, MessageTypes, GofoodBot} from '../models';
import  * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  public Messages:MessageModel[] = [];
  public currentMessage:string = "";
  protected bot:GofoodBot = GofoodBot.Create()


  ngOnInit(){

    return this.bot
            .getTypingsMessage()
            .map((typingsMessage:MessageModel) =>{
              let messageIndex = this.Messages.push(typingsMessage);

              return messageIndex -1;
            })
            .delay(5000)            
            .flatMap((typingsMessageIndex:number) =>{
              return this.bot.sayGreetings()
                      .map((typingsMessage:MessageModel) =>{
                        this.Messages[typingsMessageIndex] = typingsMessage;
                      })

            })
            .toPromise();

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
    let message1:MessageModel = new MessageModel(this.currentMessage, MessageTypes.RegularText);
    message1.User.PicUrl = "https://avatars0.githubusercontent.com/u/393533?v=3&s=460";
    message1.User.Username = "Me";
    message1.SentTime = moment().unix()

    this.Messages.push(message1);

    this.currentMessage = "";
  }
}
