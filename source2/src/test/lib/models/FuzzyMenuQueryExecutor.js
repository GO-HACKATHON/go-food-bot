"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx = require("rxjs/Rx");
const FoodMenusData_1 = require("./FoodMenusData");
const Fuse = require('./fuse');
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
var fuse = new Fuse(FoodMenusData_1.FoodMenusData, options);
class FuzzyMenuQueryExecutor {
    filterAllMenuWithPrice(operator, operand) {
        return Rx.Observable.from(FoodMenusData_1.FoodMenusData)
            .filter((foodMenu) => {
            if (operator === ">") {
                return foodMenu.Price > operand;
            }
            else if (operator === "<") {
                return foodMenu.Price < operand;
            }
            else {
                return foodMenu.Price === operand;
            }
        })
            .toArray();
    }
    isNumber(str) {
        let floatVal = parseFloat(str);
        return !isNaN(floatVal) && isFinite(floatVal);
    }
    query(queryText) {
        console.log("queryText:", queryText);
        return Rx.Observable.create(s => {
            queryText = queryText || "";
            queryText = queryText.trim();
            let parts = queryText.split(" ");
            if (queryText.startsWith("lihat menu")) {
                queryText = queryText.replace("lihat menu ", "");
                let queryParts = queryText.split(" ");
                console.log(queryParts);
                if (queryParts.length > 1) {
                    let operator = queryParts[0].trim();
                    let operand = queryParts[1].trim();
                    if (this.isNumber(operand)) {
                        let operandNumeric = parseFloat(operand);
                        this.filterAllMenuWithPrice(operator, operandNumeric)
                            .subscribe(results => {
                            s.next(results);
                            s.complete();
                        });
                    }
                    else {
                        let results = fuse.search(queryText);
                        s.next(results);
                        s.complete();
                    }
                }
                else {
                    let results = fuse.search(queryText);
                    s.next(results);
                    s.complete();
                }
            }
            else {
                let results = fuse.search(queryText);
                s.next(results);
                s.complete();
            }
        });
    }
}
exports.FuzzyMenuQueryExecutor = FuzzyMenuQueryExecutor;
