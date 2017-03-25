import * as Rx from "rxjs/Rx";
import {FoodMenuModel} from "./FoodMenuModel";

export interface IMenuQueryExecutor{
    query(queryText:string):Rx.Observable<FoodMenuModel[]>    
}
