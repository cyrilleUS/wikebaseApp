import {Injectable} from 'angular2/core';
import {DefaultContactList} from '../models/defaultContactList';
import {User} from '../models/user';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserServices {
    loggedUser: User;
    getUserForLogin() {
      return Observable.create(observer => {
          observer.next(this.loggedUser);
          observer.complete();
      });
    }

    init() {
      this.loggedUser =
      {
        "id":1547,
        "firstName":"Denis",
        "lastName":"Denis"
      };
    }
}
