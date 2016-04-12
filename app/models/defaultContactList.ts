import {Contact} from './contact';

export class DefaultContactList {
  contactList: Contact[];
  constructor () {
    this.contactList = [
    {
      "id":0,
      "firstName":"jean",
      "lastName":"lecanuet",
      "email": "j.l@gmail.com",
      "addressStreet": "rue malherbe",
      "addressCity": "Paris",
      "addressState": "Ile de france",
      "addressCode": 75015,
      "addressCountry": "France"
    },
    {
      "id":0,
      "firstName":"jean",
      "lastName":"bon",
      "email": "j.l@cohonou.com",
      "addressStreet": "rue saucisson",
      "addressCity": "Strasbourg",
      "addressState": "GrasLande",
      "addressCode": 66666,
      "addressCountry": "France"
    },
    {
      "id":0,
      "firstName":"sens",
      "lastName":"bon",
      "email": "j.l@channel.com",
      "addressStreet": "rue parfum",
      "addressCity": "HuuuuuuuuuuumCaSentBon",
      "addressState": "JoliLande",
      "addressCode": 53123,
      "addressCountry": "France"
    }
  ];
  }
}
