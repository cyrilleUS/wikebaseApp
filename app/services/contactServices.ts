import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {Contact} from '../models/contact';
import {Observable} from 'rxjs/Observable';
import {UserServices} from './userServices';
import {RestMessage} from '../models/restMessage';
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
    //initiate contactList
    init() {
      let restMessage: RestMessage;
      this.callListContact().subscribe(
        data => {
          restMessage = data;
          console.log("restMessage recieved: status:"+restMessage.status);
          if(restMessage.status == "success") {
              this.contactList = restMessage.multipleResults;
          }else{
            this.contactList = this.setUpEmptyContactList();
            //fire an event with "remote server error, try to login again"
            //handle the error to give better explanation
          }
        },
        error => {
          console.log("error subscribing restMessage");
          return 0;
        }
      );
    }
    //RestCall to get a list of Contacts
    callListContact(){
      console.log("callListContact, userService.id="+this.userServices.loggedUser.idUser);
      let body = "locale=fr_US&userId="+ this.userServices.loggedUser.idUser;
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(listContactURL, body, options)
          .map(res => res.json())
          .catch(this.handleError);
    }
    //RestCall to save a contact
    callSaveContact(contact: Contact){
      console.log("callSaveContact, userService.id="+this.userServices.loggedUser.idUser);
      let body = "locale=fr_US&userId="+ this.userServices.loggedUser.idUser + this.stringifyContact(contact);
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(addContactURL, body, options)
          .map(res => res.json())
          .catch(this.handleError);
    }

    getAll() {
      return this.contactList;
    }
    getContactListSize(){
      return this.contactList.length;
    }
    addContact(contact: Contact, callBack: (message:String,nav:any)=>void,nav: any) {
      let restMessage: RestMessage;
      this.callSaveContact(contact).subscribe(
        data => {
          restMessage = data;
          console.log("restMessage recieved: status:"+restMessage.status);
          if(restMessage.status == "success") {
              this.contactList.push(restMessage.singleResult);
              console.log("it's a sucess");
              callBack("it's a sucess",nav);
          }else{
            //messageToDisplay = "error from server";
            console.log("it's a failure");
            callBack("it's a failure",nav);
            //fire an event with "remote server error, contact could not be saved"
            //handle the error to give better explanation
          }
        },
        error => {
          console.log("error subscribing restMessage");
          //messageToDisplay = "server error";
          console.log("oops pb!");
          callBack("server error",nav);
        }
      );
    }

    stringifyContact(contact: Contact) {
      let output: String = "";
      if(contact.idContact) {
        output += "&id="+contact.idContact;
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
    setUpEmptyContactList(){
      let contactList: Contact[];
      contactList = [
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
    return contactList;
    }
}
