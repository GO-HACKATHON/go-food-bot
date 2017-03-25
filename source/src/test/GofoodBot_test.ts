import {MessageModel, MessageTypes, GofoodBot} from '../models';

import {assert} from 'chai';
import * as moment from 'moment';


describe("GofoodBot", function(){
    describe('sayGreetings()', function(){
        it('return greetings message', async function(){
            let bot:GofoodBot = GofoodBot.Create();

            let  greetings:MessageModel =  await bot.sayGreetings().toPromise();

            assert.equal(greetings.Message, "Halo Irwansyah! Kamu mau langsung pesan atau lihat menu?")
            assert.equal(greetings.User.PicUrl, "https://mustafit.files.wordpress.com/2017/01/gofood.jpg")
            assert.equal(greetings.User.Username, "Go-food Bot")
        })
    })
});