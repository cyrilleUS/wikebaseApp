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
      let loggerMethod: string = ".init";
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
                    console.log( loggerHeader + loggerMethod + " fieldError: " + data.technicalErrorMessage );
                  }
              );
            }else if( restErrors.globalErrors && ( restErrors.globalErrors.length != 0 ) ){
                globalErrors = restErrors.globalErrors;
                globalErrors.forEach(
                    (data) => {
                      outputErrorMessage += data.userErrorMessage;
                      console.log( loggerHeader + loggerMethod + " globalError: " + data.technicalErrorMessage + " " + data.technicalErrorDetails );
                    }
                );
            }else{
              outputErrorMessage += "no detail to display";
              console.log( loggerHeader + loggerMethod + "EmptyErrors: " + restErrors.empty );
            }
            if ( outputErrorMessage.length != 0 ){
              this.initErrorMessage = outputErrorMessage;
            }
          }else{
            this.contactList = this.setUpEmptyContactList();
            this.initErrorMessage = "restMessageStatus undefinied: bad request";
            console.error(loggerHeader + loggerMethod + "restMessageStatus undefinied: bad request");
          }
        },
        error => {
          this.initErrorMessage = "error subscribing restMessage" + error;
          console.error( loggerHeader + loggerMethod + ", error subscribing restMessage: " + error );
        }
      );
    }
    //RestCall to get a list of Contacts
    callListContact(){

      let body = "locale=fr_US";
      if (this.userServices.loggedUser && this.userServices.loggedUser.sessionToken){
        let sessionToken: string = this.userServices.loggedUser.sessionToken;
        body += "&sessionToken=" + sessionToken;
      }
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
      //console.log("callSaveContact, userService.id="+this.userServices.loggedUser.idUser);
      let body = "locale=fr_US";
      if (this.userServices.loggedUser && this.userServices.loggedUser.sessionToken){
        let sessionToken: string = this.userServices.loggedUser.sessionToken;
        body += "&sessionToken=" + sessionToken;
      }
      body += this.stringifyContact(contact);
      console.log("before request, body="+body);
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
      let loggerMethod: string = ".addContact";
      let restMessage: RestMessage;
      this.callSaveContact(contact).subscribe(
        data => {
          restMessage = data;
          if(restMessage.status == "success") {
              this.contactList.push(restMessage.singleResult);
              successCallback("sucessfully!",nav);
          }else if ( restMessage.status == "failure" ){
            let restErrors: RestErrors = restMessage.errors;
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
                    console.log( loggerHeader + loggerMethod + " fieldError: " + data.technicalErrorMessage );
                  }
              );
            }else if( restErrors.globalErrors && ( restErrors.globalErrors.length != 0 ) ){
                globalErrors = restErrors.globalErrors;
                globalErrors.forEach(
                    (data) => {
                      outputErrorMessage += data.userErrorMessage;
                      console.log( loggerHeader + loggerMethod + " globalError: " + data.technicalErrorMessage + " " + data.technicalErrorDetails );
                    }
                );
            }else{
              outputErrorMessage += "no detail to display";
              console.log( loggerHeader + loggerMethod + "EmptyErrors: " + restErrors.empty );
            }
            errorCallback(outputErrorMessage,nav);
          }else{
            this.contactList = this.setUpEmptyContactList();
            let errorMessage = "restMessageStatus undefinied: bad request";
            console.error( loggerHeader + loggerMethod + errorMessage);
            errorCallback("the server did not respond correctly",nav);
          }

        },
        error => {
          console.error( loggerHeader + loggerMethod + "error subscribing restMessage" );
          errorCallback("internal error",nav);
        }
      );
    }

    stringifyContact(contact: Contact) {
      let output: string = "";
      if(contact.idContact) { console.log("stringifiying idContact: "+contact.idContact); output += "&id="+contact.idContact; }
      if(contact.firstName) { console.log("stringifiying firstName: "+contact.firstName); output += "&firstName="+contact.firstName; }
      if(contact.lastName) { console.log("stringifiying lastName: "+contact.lastName); output += "&lastName="+contact.lastName; }
      if(contact.email) { console.log("stringifiying email: "+contact.email); output += "&email="+contact.email; }
      if(contact.addressStreet) { console.log("stringifiying addressStreet: "+contact.addressStreet); output += "&addressStreet="+contact.addressStreet; }
      if(contact.addressCity) { console.log("stringifiying addressCity: "+contact.addressCity); output += "&addressCity="+contact.addressCity; }
      if(contact.addressState) { console.log("stringifiying addressState: "+contact.addressState); output += "&addressState="+contact.addressState; }
      if(contact.addressCode) { console.log("stringifiying addressCode: "+contact.addressCode); output += "&addressCode="+contact.addressCode; }
      if(contact.addressCountry) { console.log("stringifiying addressCountry: "+contact.addressCountry); output += "&addressCountry="+contact.addressCountry; }
      return output;
    }

    handleCallError( error ) {
        console.error("error parding restMessage"+error);
        return Observable.throw(error.json().error || 'Server error');
    }
    setUpEmptyContactList(){
      console.log("setUpEmptyContactList");
      let contactList: Array<Contact>;
      let emptyContact: Contact = {"idContact": "","firstName": "","lastName": "","email": "","addressStreet": "","addressCity": "","addressState": "","addressCode": "","addressCountry": ""};
      contactList = [emptyContact];
    return contactList;
    }
}
