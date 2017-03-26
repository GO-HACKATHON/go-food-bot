"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const chai_1 = require("chai");
const moment = require("moment");
describe("MessageModel", function () {
    describe("Creating a new message", function () {
        it("must expect non empty message", function () {
            try {
                let msg = new models_1.MessageModel("", models_1.MessageTypes.RegularText, null);
            }
            catch (error) {
                chai_1.assert.isNotNull(error, "error must not null");
                chai_1.assert.equal(new Error("Message must not empty").message, error.message);
                return;
            }
            chai_1.assert.fail("must not reach here");
        });
        it("must assign correct sentTime value", function () {
            let msg = new models_1.MessageModel("adasd", models_1.MessageTypes.RegularText, null);
            let now = moment();
            let sentDateMoment = moment(msg.SentTime);
            chai_1.assert.isAbove(msg.SentTime, 0, "Sent time must be greater than zero");
            chai_1.assert.isTrue(sentDateMoment.isSameOrBefore(now, "millisecond"), "sentTime must less than now time");
        });
    });
});
