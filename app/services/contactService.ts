import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

import {ErrorService} from './errorService';
import {UserService} from './userService';

import {WkContact} from '../models/wkContact';
import {RestMessage} from '../models/restMessage';
import 'rxjs/Rx';

let favorites = [],
    domain = "http://www.valleydesigners.com",
    listContactURL = domain + "/mobileApp/MobileAppCompanyCross/listContact",
    addContactURL = domain + "/mobileApp/MobileAppCompanyCross/addContact",
    editContactURL = domain + "/mobileApp/MobileAppCompanyCross/editContact",
    deleteContactURL = domain + "/mobileApp/MobileAppCompanyCross/deleteContact"

@Injectable()
export class ContactService {
    http: Http;
    errorService: ErrorService;
    userService: UserService;
    contactList: Array<WkContact>;
    initErrorMessage: string;
    initiated: boolean = false;
    private _loggerHeader: string = "error in contactServices";

    constructor (http: Http, userService: UserService, errorService: ErrorService) {
      this.http = http;
      this.errorService = errorService;
      this.userService = userService;
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
              this.alphaAscSort();
              this.initiated = true;
          }else if ( restMessage.status == "failure" ){
            let errorMessage: string;
            this.errorService.handleRestMessageError(restMessage.errors, this._loggerHeader + loggerMethod).subscribe(
              data => { errorMessage = data; },
              error => { console.log("subscription error, should not happen");},
              () => {
                this.contactList = this.setUpEmptyContactList();
                this.initErrorMessage = errorMessage;
                this.initiated = false;
              }
            );
          }else{
            let errorMessage: string;
            this.errorService.handleUndefinedRestMessageError(this._loggerHeader + loggerMethod).subscribe(
              data => { errorMessage = data; },
              error => { console.log("subscription error, should not happen");},
              () => {
                this.contactList = this.setUpEmptyContactList();
                this.initErrorMessage = errorMessage;
                this.initiated = false;
              }
            );
          }
        },
        error => {
          let errorMessage: string;
          this.errorService.handleSubscribeError(error, this._loggerHeader + loggerMethod).subscribe(
            data => { errorMessage = data; },
            error => { console.log("subscription error, should not happen");},
            () => {
              this.contactList = this.setUpEmptyContactList();
              this.initErrorMessage = errorMessage;
              this.initiated = false;
            }
          );
        }
      );
    }
//******************************************************************************
//REST CALLS********************************************************************
//******************************************************************************
//get the list of Contacts accessible to the user
    callListContact(){
      let body = "locale=fr_US";
      if (this.userService.loggedUser && this.userService.loggedUser.sessionToken){
        let sessionToken: string = this.userService.loggedUser.sessionToken;
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
          .catch( this.errorService.handleCallError );
    }
    //RestCall to save a contact
    callSaveContact( contact: WkContact ){
      let body = "locale=fr_US";
      if (this.userService.loggedUser && this.userService.loggedUser.sessionToken){
        let sessionToken: string = this.userService.loggedUser.sessionToken;
        body += "&sessionToken=" + sessionToken;
      }
      body += this.toXformString(contact);

      let headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      let options = new RequestOptions({
        headers: headers
      });
      return this.http.post( addContactURL, body, options )
          .map(res => res.json())
          .catch( this.errorService.handleCallError );
    }

    callEditContact( contact: WkContact ){
      let body = "locale=fr_US";
      if (this.userService.loggedUser && this.userService.loggedUser.sessionToken){
        let sessionToken: string = this.userService.loggedUser.sessionToken;
        body += "&sessionToken=" + sessionToken;
      }
      body += this.toXformString(contact);
      let headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      let options = new RequestOptions({
        headers: headers
      });
      return this.http.post( editContactURL, body, options )
          .map(res => res.json())
          .catch( this.errorService.handleCallError );
    }

    callDeleteContact( contact: WkContact ){
      let body = "locale=fr_US";
      if (this.userService.loggedUser && this.userService.loggedUser.sessionToken){
        let sessionToken: string = this.userService.loggedUser.sessionToken;
        body += "&sessionToken=" + sessionToken;
      }
      body += this.toXformString(contact);
      let headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      let options = new RequestOptions({
        headers: headers
      });
      return this.http.post( deleteContactURL, body, options )
          .map(res => res.json())
          .catch( this.errorService.handleCallError );
    }
//******************************************************************************
    isInitiated(){
      return this.initiated;
    }
    getAll() {
      this.alphaAscSort();
      return this.contactList;
    }
    getContactListSize(){
      return this.contactList.length;
    }
    addContact( contact: WkContact, successCallback: ( message: string, nav:any ) => void, errorCallback: ( message: string, nav:any ) => void, component: any ) {
      let loggerMethod: string = ".addContact";
      let restMessage: RestMessage;
      this.callSaveContact(contact).subscribe(
        data => {
          restMessage = data;
        },
        error => {
          errorCallback( this.errorService.handleSubscribeError( error, this._loggerHeader + loggerMethod), component );
        },
        () => {
          if(restMessage.status == "success") {
              this.contactList.push( restMessage.singleResult );
              successCallback("sucessfully!", component);
          }else if ( restMessage.status == "failure" ){
            errorCallback( this.errorService.handleRestMessageError( restMessage.errors, this._loggerHeader + loggerMethod), component );
          }else{
            let errorMessage = "restMessageStatus undefinied: bad request";
            console.error( this._loggerHeader + loggerMethod + errorMessage);
            errorCallback( this.errorService.handleUndefinedRestMessageError( this._loggerHeader + loggerMethod), component );
          }
        }
      );
    }
    editContact( contact: WkContact, successCallback: ( nav: any ) => void, errorCallback: ( errorMessage: Observable<string>, nav: any ) => void, successComponent: any, errorComponent: any ) {
      let loggerMethod: string = ".editContact";
      let restMessage: RestMessage;
      this.callEditContact( contact ).subscribe(
        //observable.next
        data => {
          restMessage = data;
        },
        //observable.error
        error => {
          console.error( this._loggerHeader + loggerMethod + "error subscribing restMessage" + error);
        },
        //observable.complete
        () => {
        if(restMessage.status == "success") {
            let updatedContact : WkContact = restMessage.singleResult;
            this.contactList[this.getContactIndexById(updatedContact.idContact)] = updatedContact;
            successCallback(successComponent);
        }else if ( restMessage.status == "failure" ){
          //let errorMessage = this.handleRestMessageError( restMessage.errors, loggerMethod);
          errorCallback( this.errorService.handleRestMessageError( restMessage.errors, loggerMethod), errorComponent );
        }else{
          let errorMessage = "restMessageStatus undefinied: bad request";
          console.error( this._loggerHeader + loggerMethod + errorMessage);
          //errorCallback("the server did not respond correctly",nav);
        }
      }
      );
    }

    sortContactByName() {
      this.alphaAscSort();
      return this.contactList;
    }

    sortContactByDate() {
      this.contactList.sort(
        (contact1, contact2) => {
          if (contact1.idContact < contact2.idContact) return -1;
          if (contact1.idContact > contact2.idContact) return 1;
        return 0;
      });
      return this.contactList;
    }

    deleteContact( contact: WkContact, successCallback: ( nav: any ) => void, errorCallback: ( errorMessage: Observable<string>, nav: any ) => void, component:any ){
      let loggerMethod: string = ".deleteContact";
      let restMessage: RestMessage;
      let idContactToDelete: string = contact.idContact;
      this.callDeleteContact( contact ).subscribe(
        //observable.next
        data => {
          restMessage = data;
        },
        //observable.error
        error => {
          console.error( this._loggerHeader + loggerMethod + "error subscribing restMessage" + error);
        },
        //observable.complete
        () => {
        if(restMessage.status == "success") {
            let updatedContact : Contact = restMessage.singleResult;
            this.contactList.splice(this.getContactIndexById(idContactToDelete),1);
            successCallback(component);
        }else if ( restMessage.status == "failure" ){
          //let errorMessage = this.handleRestMessageError( restMessage.errors, loggerMethod);
          errorCallback( this.errorService.handleRestMessageError( restMessage.errors, loggerMethod), component );
        }else{
          let errorMessage = "restMessageStatus undefinied: bad request";
          console.error( this._loggerHeader + loggerMethod + errorMessage);
          //errorCallback("the server did not respond correctly",nav);
        }
      }
      );
    }
//******************************************************************************
//PRIVATE METHODS
//******************************************************************************

    private toXformString(contact: WkContact) {
      let output: string = "";
      if(contact.idContact) { output += "&idContact="+contact.idContact; }
      if(contact.firstName) { output += "&firstName="+contact.firstName; }
      if(contact.lastName) { output += "&lastName="+contact.lastName; }
      if(contact.email) { output += "&email="+contact.email; }
      if(contact.addressStreet) { output += "&addressStreet="+contact.addressStreet; }
      if(contact.addressCity) { output += "&addressCity="+contact.addressCity; }
      if(contact.addressState) { output += "&addressState="+contact.addressState; }
      if(contact.addressCode) { output += "&addressCode="+contact.addressCode; }
      if(contact.addressCountry) { output += "&addressCountry="+contact.addressCountry; }
      if(contact.mobileNumber) { output += "&mobileNumber="+contact.mobileNumber; }
      if(contact.phoneNumber) { output += "&phoneNumber="+contact.phoneNumber; }
      return output;
    }

    private setUpEmptyContactList(){
      let contactList: Array<WkContact>;
      let emptyContact: WkContact = {"idContact": "","firstName": "","lastName": "","email": "","addressStreet": "","addressCity": "","addressState": "","addressCode": "","addressCountry": "", "mobileNumber": "", "phoneNumber": ""};
      contactList = [emptyContact];
    return contactList;
    }

    private alphaAscSort(){
        this.contactList.sort(
          (conact1, contact2) => {
            if (conact1.lastName.toLowerCase() < contact2.lastName.toLowerCase()) return -1;
            if (conact1.lastName.toLowerCase() > contact2.lastName.toLowerCase()) return 1;
          return 0;
        });
    }

    private getContactIndexById(idContact:string){
      let index=-1;
      let i:number;
      for (i =0; i < this.contactList.length; i++){
        if (this.contactList[i].idContact == idContact){
          index = i;
          break;
        }
      }
      return index;
    }
}