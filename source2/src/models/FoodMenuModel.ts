import {RestaurantModel} from "./RestaurantModel";

export class FoodMenuModel{
    constructor(public Name:string, public Description:string, public Price:number, public restaurant:RestaurantModel){

    }
}
