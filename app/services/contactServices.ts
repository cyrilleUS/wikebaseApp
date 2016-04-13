import {Injectable} from 'angular2/core';
import {DefaultContactList} from '../models/defaultContactList';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {Contact} from '../models/contact';
import {Observable} from 'rxjs/Observable';
import {UserServices} from './userServices';
import 'rxjs/Rx';

let favorites = [],
    listContactURL = "http://local.uniquesound.com/mobileApp/MobileAppCompanyCross" + '/listContact',
    addContactURL = "http://local.uniquesound.com/mobileApp/MobileAppCompanyCross" + '/addContact';

@Injectable()
export class ContactServices {
    contactList: Contact[];
    http: Http;
    userServices: UserServices;

    constructor (http: Http, userServices: UserServices) {
      this.http = http;
      this.userServices = userServices;
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
      this.addContact(this.contactList[this.contactList.length-1]);
    }

    getAll() {
      let body = "locale=fr_US&userId="+ this.userServices.loggedUser.id;
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(listContactURL, body, options)
          .map(res => function(){console.log(res);res.json();})
          .catch(this.handleError);
    }

    addContact(contact: Contact) {
        let body = "locale=fr_US&userId="+ this.userServices.loggedUser.id + this.stringifyContact(contact);
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(addContactURL, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    stringifyContact(contact: Contact) {
      let output: String = "";

      if(contact.id) {
        output += "&id="+contact.id;
      }
      if(contact.firstName) {
        output += "&firstName="+contact.firstName;
      }
      if(contact.lastName) {
        output += "&lastName="+contact.lastName;
      }
      if(contact.email) {
        output += "&email="+contact.email;
      }
      if(contact.addressStreet) {
        output += "&addressStreet="+contact.addressStreet;
      }
      if(contact.addressCity) {
        output += "&addressCity="+contact.addressCity;
      }
      if(contact.addressState) {
        output += "&addressState="+contact.addressState;
      }
      if(contact.addressCode) {
        output += "&addressCode="+contact.addressCode;
      }
      if(contact.addressCountry) {
        output += "&addressCountry="+contact.addressCountry;
      }

      return output;
    }

    handleError(error) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
