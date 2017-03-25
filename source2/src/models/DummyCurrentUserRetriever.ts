import * as Rx from 'rxjs/Rx';
import {IUserRetriever} from './IUserRetriever';
import {UserModel} from './UserModel';

export class DummyCurrentUserRetriever implements IUserRetriever{

    getUser():Rx.Observable<UserModel>{
        let user:UserModel = new UserModel();
        // user.PicUrl = "https://avatars3.githubusercontent.com/u/393533?v=3&u=cb9508c2c45ea4a8677c2f99a6de73c015bf8db0&s=400";
        user.PicUrl = "https://scontent-sit4-1.xx.fbcdn.net/v/t1.0-1/64767_10202758933813512_4581591136467101320_n.jpg?oh=7ae3806f479536b2b8b9a894c08170c9&oe=59553B50";
        user.Username = "Norma";

        return Rx.Observable.from([user]);
    }

}
