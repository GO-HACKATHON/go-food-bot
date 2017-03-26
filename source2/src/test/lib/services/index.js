"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx = require("rxjs/Rx");
const models_1 = require("../models");
class DummyDishesTypeRetriever {
    getDishesTypes() {
        return Rx.Observable.create(s => {
            let dishes = [
                new models_1.DishesTypeModel("Martabak", "https://media-cdn.tripadvisor.com/media/photo-s/06/e3/c8/30/martabak-burger-kalkun.jpg"),
                new models_1.DishesTypeModel("Aneka Nasi", "https://media-cdn.tripadvisor.com/media/photo-s/06/e3/c8/30/martabak-burger-kalkun.jpg"),
                new models_1.DishesTypeModel("Aneka Ayam & Bebek", "https://media-cdn.tripadvisor.com/media/photo-s/06/e3/c8/30/martabak-burger-kalkun.jpg"),
                new models_1.DishesTypeModel("Snack dan Jajanan", "https://media-cdn.tripadvisor.com/media/photo-s/06/e3/c8/30/martabak-burger-kalkun.jpg"),
                new models_1.DishesTypeModel("Pizza dan Pasta", "https://media-cdn.tripadvisor.com/media/photo-s/06/e3/c8/30/martabak-burger-kalkun.jpg"),
                new models_1.DishesTypeModel("Fastfood", "https://media-cdn.tripadvisor.com/media/photo-s/06/e3/c8/30/martabak-burger-kalkun.jpg"),
                new models_1.DishesTypeModel("Minuman", "https://media-cdn.tripadvisor.com/media/photo-s/06/e3/c8/30/martabak-burger-kalkun.jpg"),
            ];
            s.next(dishes);
            s.complete();
        });
    }
}
exports.DummyDishesTypeRetriever = DummyDishesTypeRetriever;
