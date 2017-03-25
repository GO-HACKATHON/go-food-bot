"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const models_1 = require('../models');
const chai_1 = require('chai');
describe("GofoodBot", function () {
    describe('sayGreetings()', function () {
        it('return greetings message', function () {
            return __awaiter(this, void 0, void 0, function* () {
                let bot = models_1.GofoodBot.Create();
                let greetings = yield bot.sayGreetings().toPromise();
                chai_1.assert.equal(greetings.Message, "Halo Norma! Kamu mau langsung pesan atau lihat menu?");
                chai_1.assert.equal(greetings.User.PicUrl, "https://mustafit.files.wordpress.com/2017/01/gofood.jpg");
                chai_1.assert.equal(greetings.User.Username, "Go-food Bot");
            });
        });
    });
});
