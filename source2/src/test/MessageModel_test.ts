import {MessageModel, MessageTypes} from '../models';

import {assert} from 'chai';
import * as moment from 'moment';

declare let describe:any;
declare let it:any;

describe("MessageModel", function(){
    describe("Creating a new message", function(){
        it("must expect non empty message", function(){
            try {
                let msg:MessageModel = new MessageModel("", MessageTypes.RegularText, null)                
            } catch (error) {
                assert.isNotNull(error, "error must not null");
                assert.equal(new Error("Message must not empty").message, error.message);
                return;
            }
            assert.fail("must not reach here");
            
        })
        it("must assign correct sentTime value", function(){
            let msg:MessageModel = new MessageModel("adasd", MessageTypes.RegularText, null)
            

            let now:moment.Moment = moment();

            let sentDateMoment:moment.Moment = moment(msg.SentTime);

            

            assert.isAbove(msg.SentTime, 0, "Sent time must be greater than zero");

            assert.isTrue(sentDateMoment.isSameOrBefore(now, "millisecond"), "sentTime must less than now time");
        })
    })
})


