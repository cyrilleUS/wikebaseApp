import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {Contact} from '../models/contact';
import {Observable} from 'rxjs/Observable';
import {UserServices} from './userServices';
import {RestMessage} from '../models/restMessage';
import {RestErrors} from '../models/restErrors';
import {FieldError} from '../models/fieldError';
import {GlobalError} from '../models/globalError';
import 'rxjs/Rx';

let favorites = [],
    listContactURL = "http://local.uniquesound.com/mobileApp/MobileAppCompanyCross" + "/listContact",
    addContactURL = "http://local.uniquesound.com/mobileApp/MobileAppCompanyCross" + "/addContact",
    loggerHeader = "error in contactServices";

@Injectable()
export class ContactServices {
    contactList: Array<Contact>;
    http: Http;
    userServices: UserServices;
    initErrorMessage: string;

    constructor (http: Http, userServices: UserServices) {
      this.http = http;
      this.userServices = userServices;
    }
    //initiate contactList
    init() {
      let restMessage: RestMessage;
      //call http post, response is already parsed to json
      this.callListContact().subscribe(
        data => {
          restMessage = data;
          //check restMessage status and proceed
          if( restMessage.status == "success" ) {
              this.contactList = restMessage.multipleResults;
              this.initErrorMessage = "";
          }else if ( restMessage.status == "failure" ){
            let restErrors: RestErrors;
            this.contactList = this.setUpEmptyContactList();
            restErrors = restMessage.errors;
            let fieldErrors: Array<FieldError>;
            let globalErrors: Array<GlobalError>;
            let outputErrorMessage : string = "";
            if ( restErrors.fieldErrors && ( restErrors.fieldErrors.length != 0 ) ){
              fieldErrors = restErrors.fieldErrors;
              fieldErrors.forEach(
                  (data) => {
                    outputErrorMessage += data.fieldName;
                    outputErrorMessage += ": "
                    outputErrorMessage += data.userErrorMessage;
                    console.log( loggerHeader + " fieldError: " + data.technicalErrorMessage );
                  }
              );
            }else if( restErrors.globalErrors && ( restErrors.globalErrors.length != 0 ) ){
                globalErrors = restErrors.globalErrors;
                globalErrors.forEach(
                    (data) => {
                      outputErrorMessage += data.userErrorMessage;
                      console.log( loggerHeader + " globalError: " + data.technicalErrorMessage + " " + data.technicalErrorDetails );
                    }
                );
            }else{
              outputErrorMessage += "no detail to display";
              console.log( loggerHeader + "EmptyErrors: " + restErrors.empty );
            }
            if ( outputErrorMessage.length != 0 ){
              this.initErrorMessage = outputErrorMessage;
            }
          }else{
            this.contactList = this.setUpEmptyContactList();
            this.initErrorMessage = "restMessageStatus undefinied: bad request";
            console.error(loggerHeader+"restMessageStatus undefinied: bad request");
          }
        },
        error => {
          this.initErrorMessage = "error subscribing restMessage" + error;
          console.error( loggerHeader + "error subscribing restMessage" + error );
        }
      );
    }
    //RestCall to get a list of Contacts
    callListContact(){
      let body = "locale=fr_US&userId=" + this.userServices.loggedUser.idUser;
      let headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      let options = new RequestOptions({
        headers: headers
      });
      return this.http.post( listContactURL, body, options )
          .map( res => res.json() )
          .catch( this.handleCallError );
    }
    //RestCall to save a contact
    callSaveContact( contact: Contact ){
      console.log("callSaveContact, userService.id="+this.userServices.loggedUser.idUser);
      let body = "locale=fr_US&userId=" + this.userServices.loggedUser.idUser + this.stringifyContact(contact);
      let headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      let options = new RequestOptions({
        headers: headers
      });
      return this.http.post( addContactURL, body, options )
          .map(res => res.json())
          .catch( this.handleCallError );
    }

    getAll() {
      return this.contactList;
    }
    getContactListSize(){
      return this.contactList.length;
    }
    addContact( contact: Contact, successCallback: ( message: string, nav:any ) => void, nav: any, errorCallback: ( message: string, nav:any ) => void ) {
      let restMessage: RestMessage;
      this.callSaveContact(contact).subscribe(
        data => {
          restMessage = data;
          if(restMessage.status == "success") {
              this.contactList.push(restMessage.singleResult);
              //console.log("it's a sucess");
              successCallback("it's a sucess",nav);
          }else{
            //messageToDisplay = "error from server";
            console.log("it's a failure");
            errorCallback("it's a failure",nav);
            //fire an event with "remote server error, contact could not be saved"
            //handle the error to give better explanation
          }
        },
        error => {
          console.log("error subscribing restMessage");
          //messageToDisplay = "server error";
          console.log("oops pb!");
          errorCallback("server error",nav);
        }
      );
    }

    stringifyContact(contact: Contact) {
      let output: string = "";
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

    handleCallError( error ) {
        console.error("error parding restMessage"+error);
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
