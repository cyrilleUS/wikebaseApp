import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

import {ErrorService} from './errorService';
import {UserServices} from './userServices';

import {Contact} from '../models/contact';
import {RestMessage} from '../models/restMessage';
import 'rxjs/Rx';

let favorites = [],
    listContactURL = "http://local.uniquesound.com/mobileApp/MobileAppCompanyCross" + "/listContact",
    addContactURL = "http://local.uniquesound.com/mobileApp/MobileAppCompanyCross" + "/addContact",
    editContactURL = "http://local.uniquesound.com/mobileApp/MobileAppCompanyCross" + "/editContact",
    deleteContactURL = "http://local.uniquesound.com/mobileApp/MobileAppCompanyCross" + "/deleteContact"
    
@Injectable()
export class ContactServices {
    http: Http;
    errorService: ErrorService;
    userServices: UserServices;
    contactList: Array<Contact>;
    initErrorMessage: string;
    initiated: boolean = false;
    private _loggerHeader: string = "error in contactServices";

    constructor (http: Http, userServices: UserServices, errorService: ErrorService) {
      this.http = http;
      this.errorService = errorService;
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
          .catch( this.errorService.handleCallError );
    }
    //RestCall to save a contact
    callSaveContact( contact: Contact ){
      let body = "locale=fr_US";
      if (this.userServices.loggedUser && this.userServices.loggedUser.sessionToken){
        let sessionToken: string = this.userServices.loggedUser.sessionToken;
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

    callEditContact( contact: Contact ){
      let body = "locale=fr_US";
      if (this.userServices.loggedUser && this.userServices.loggedUser.sessionToken){
        let sessionToken: string = this.userServices.loggedUser.sessionToken;
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

    callDeleteContact( contact: Contact ){
      let body = "locale=fr_US";
      if (this.userServices.loggedUser && this.userServices.loggedUser.sessionToken){
        let sessionToken: string = this.userServices.loggedUser.sessionToken;
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
    addContact( contact: Contact, successCallback: ( message: string, nav:any ) => void, errorCallback: ( message: string, nav:any ) => void, component: any ) {
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
    editContact( contact: Contact, successCallback: ( nav: any ) => void, errorCallback: ( errorMessage: Observable<string>, nav: any ) => void, component:any ) {
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
          //errorCallback("internal error or connection aborted",nav);
        },
        //observable.complete
        () => {
        if(restMessage.status == "success") {
            let updatedContact : Contact = restMessage.singleResult;
            this.contactList[this.getContactIndexById(updatedContact.idContact)] = updatedContact;
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
    deleteContact( contact: Contact, successCallback: ( nav: any ) => void, errorCallback: ( errorMessage: Observable<string>, nav: any ) => void, component:any ){
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
          //errorCallback("internal error or connection aborted",nav);
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

    private toXformString(contact: Contact) {
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
      return output;
    }

    private setUpEmptyContactList(){
      let contactList: Array<Contact>;
      let emptyContact: Contact = {"idContact": "","firstName": "","lastName": "","email": "","addressStreet": "","addressCity": "","addressState": "","addressCode": "","addressCountry": ""};
      contactList = [emptyContact];
    return contactList;
    }

    private alphaAscSort(){
        this.contactList.sort(
          (conact1, contact2) => {
            if (conact1.lastName < contact2.lastName) return -1;
            if (conact1.lastName > contact2.lastName) return 1;
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
