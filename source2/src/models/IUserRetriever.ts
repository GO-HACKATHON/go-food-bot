import * as Rx from 'rxjs/Rx';

import {UserModel} from './UserModel';

export interface IUserRetriever{
    getUser():Rx.Observable<UserModel>;
}
