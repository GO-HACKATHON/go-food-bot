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
        // "restaurant.Name",
        'Price'
    ]
};

var fuse = new Fuse(FoodMenusData, options);
 
export class FuzzyMenuQueryExecutor implements IMenuQueryExecutor{

    filterAllMenuWithPrice(operator:string, operand:number):Rx.Observable<FoodMenuModel[]>{
        return Rx.Observable.from(FoodMenusData)
                .filter((foodMenu:FoodMenuModel) => {
                    if(operator === ">"){
                        return foodMenu.Price > operand
                    }
                    else if(operator === "<"){
                        return foodMenu.Price < operand
                    }
                    else{
                        return foodMenu.Price === operand
                    }
                })
                .toArray()
    }

    protected isNumber(str:string):boolean{
        let floatVal = parseFloat(str);
        return !isNaN(floatVal) && isFinite(floatVal);   
    }

    query(queryText:string):Rx.Observable<FoodMenuModel[]>{

        console.log("queryText:", queryText);

        return Rx.Observable.create(s => {
            queryText = queryText || "";
            queryText = queryText.trim();

            let parts:string[] = queryText.split(" ");

            if(queryText.startsWith("lihat menu")){
                queryText = queryText.replace("lihat menu ", "");

                let queryParts:string[] = queryText.split(" ");
                console.log(queryParts)
                if(queryParts.length > 1){
                    let operator:string = queryParts[0].trim();
                    let operand:string = queryParts[1].trim();

                    if(this.isNumber(operand)){
                        let operandNumeric = parseFloat(operand)
                        this.filterAllMenuWithPrice(operator, operandNumeric)
                            .subscribe(results => {
                                s.next(results);
                                s.complete();                                
                            })
                    }
                    else{
                        let results = fuse.search(queryText);

                        s.next(results);
                        s.complete();                        
                    }
                }            
                else{
                    let results = fuse.search(queryText);

                    s.next(results);
                    s.complete();                    
                }    
            }
            else{
                let results = fuse.search(queryText);

                s.next(results);
                s.complete();
            }

        })
                
        
    }
}