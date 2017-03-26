"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Please dont use 0 as the value
 */
var MessageTypes;
(function (MessageTypes) {
    MessageTypes[MessageTypes["RegularText"] = 1] = "RegularText";
    MessageTypes[MessageTypes["Typings"] = 2] = "Typings";
    MessageTypes[MessageTypes["Command"] = 3] = "Command";
    MessageTypes[MessageTypes["ShowMenu"] = 4] = "ShowMenu";
    MessageTypes[MessageTypes["ShowFoodMenu"] = 5] = "ShowFoodMenu";
})(MessageTypes = exports.MessageTypes || (exports.MessageTypes = {}));
