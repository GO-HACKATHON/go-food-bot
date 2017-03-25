import {IMenuQueryExecutor} from "./IMenuQueryExecutor";
import * as Rx from "rxjs/Rx";

import {FoodMenuModel} from "./FoodMenuModel";
import {RestaurantModel} from "./RestaurantModel";
import {FoodMenusData} from "./FoodMenusData";

declare let require:any;

const Fuse = require('./fuse')

var options = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        "Name",
        "restaurant.Name",
        'Price'
    ]
};

console.log("FoodMenusData", FoodMenusData)
var fuse = new Fuse(FoodMenusData, options);
 
export class FuzzyMenuQueryExecutor implements IMenuQueryExecutor{
    query(queryText:string):Rx.Observable<FoodMenuModel[]>{

        return Rx.Observable.create(s => {
            console.log(queryText);
            let results = fuse.search(queryText);

            s.next(results);
            s.complete();
        })
                
        
    }
}