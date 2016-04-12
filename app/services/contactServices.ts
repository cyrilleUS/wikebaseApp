import {Injectable} from 'angular2/core';
import {DefaultContactList} from '../models/defaultContactList';
import {Contact} from '../models/contact';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ContactServices {
    contactList: Contact[];
    getAll() {
      return Observable.create(observer => {
          observer.next(this.contactList);
          observer.complete();
      });
    }

    init() {
      this.contactList = new DefaultContactList().contactList;
    }
}
