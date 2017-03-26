import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import {MessageModel, MessageTypes,DishesTypeModel, FoodMenuModel} from '../../models';

import * as moment from 'moment';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit {

  @Input() 
  public imageSource:string = "";

  @Input() 
  public message:MessageModel = null;

  @Output() 
  public showChildDishes:EventEmitter<DishesTypeModel> = new EventEmitter();

  @Output()
  public confirmOrderingFoodMenu:EventEmitter<FoodMenuModel> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  raiseShowChildDishes(dishesType:DishesTypeModel){
    this.showChildDishes.next(dishesType);
  }

  raiseConfirmOrderingFoodMenu(foodMenu:FoodMenuModel){
    this.confirmOrderingFoodMenu.next(foodMenu);
  }

  getSentTimeString(){
    if(this.message.MessageType === MessageTypes.RegularText){
      return " - " + moment.unix(this.message.SentTime).format("LLL");
    }
    else{
      return "";
    }
  }

  isShowDishesTypesMessage(){
    return this.message != null && this.message.Message === "SHOW_DISHES_TYPES";
  }

  isShowFoodMenuMessage(){
    return this.message != null && this.message.Message === "SHOW_FOOD_MENU";
  }

  isRegularTextMessage(){
    return this.message != null && this.message.MessageType === MessageTypes.RegularText;
  }

  isTypingsMessage(){
    return this.message != null && this.message.MessageType === MessageTypes.Typings;
  }


}
