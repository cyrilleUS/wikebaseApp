import {Contact} from './contact';

export class DefaultContactList {
  contactList: Contact[];
  constructor () {

    this.contactList = [
    {
      "idContact":"0",
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
