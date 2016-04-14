import {Contact} from './contact';

export class DefaultContactList {
  contactList: Contact[];
  constructor () {

    this.contactList = [
    {
      "id":"0",
      "firstName":"",
      "lastName":"",
      "email": "",
      "addressStreet": "",
      "addressCity": "",
      "addressState": "",
      "addressCode": "",
      "addressCountry": ""
    }
  ];
  }
}
