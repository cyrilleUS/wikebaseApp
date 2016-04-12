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

    addNewContact(id: number, firstName: String, lastName: String, email: String, addressStreet: String, addressCity: String, addressState: String, addressCode: number, addressCountry: String) {
      this.contactList.push(
        {
          "id":id,
          "firstName":firstName,
          "lastName":lastName,
          "email": email,
          "addressStreet": addressStreet,
          "addressCity": addressCity,
          "addressState": addressState,
          "addressCode": addressCode,
          "addressCountry": addressCountry
        }
      )
    }
}
