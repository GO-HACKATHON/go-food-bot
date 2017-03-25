import * as Rx from 'rxjs/Rx';

import {DishesTypeModel} from '../models';

export interface IDishesTypeRetriever{
    getDishesTypes():Rx.Observable<DishesTypeModel[]>;
}

export class DummyDishesTypeRetriever implements IDishesTypeRetriever{
    getDishesTypes():Rx.Observable<DishesTypeModel[]>{
        return Rx.Observable.create(s => {
            let dishes:DishesTypeModel[] = [
                new DishesTypeModel("Martabak", "https://media-cdn.tripadvisor.com/media/photo-s/06/e3/c8/30/martabak-burger-kalkun.jpg"),
                new DishesTypeModel("Aneka Nasi", "https://media-cdn.tripadvisor.com/media/photo-s/06/e3/c8/30/martabak-burger-kalkun.jpg"),
                new DishesTypeModel("Aneka Ayam & Bebek", "https://media-cdn.tripadvisor.com/media/photo-s/06/e3/c8/30/martabak-burger-kalkun.jpg"),
                new DishesTypeModel("Snack dan Jajanan", "https://media-cdn.tripadvisor.com/media/photo-s/06/e3/c8/30/martabak-burger-kalkun.jpg"),
                new DishesTypeModel("Pizza dan Pasta", "https://media-cdn.tripadvisor.com/media/photo-s/06/e3/c8/30/martabak-burger-kalkun.jpg"),
                new DishesTypeModel("Fastfood", "https://media-cdn.tripadvisor.com/media/photo-s/06/e3/c8/30/martabak-burger-kalkun.jpg"),
                new DishesTypeModel("Minuman", "https://media-cdn.tripadvisor.com/media/photo-s/06/e3/c8/30/martabak-burger-kalkun.jpg"),
            ];

            s.next(dishes);
            s.complete();
        })
    }
}