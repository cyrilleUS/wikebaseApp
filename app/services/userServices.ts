import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

import {ErrorService} from './errorService';

import {User} from '../models/user';
import {RestMessage} from '../models/restMessage';

import 'rxjs/Rx';

let favorites = [],
    domain = "http://www.valleydesigners.com",
    loginURL = domain + "/mobileApp/MobileAppUserCross/login",
    disconnectURL = domain + "/mobileApp/MobileAppUserCross/disconnect"

@Injectable()
export class UserServices {
    loggedUser: User;
    http: Http;
    errorService: ErrorService;
    private _loggerHeader = "error in userServices";

    constructor ( http: Http, errorService: ErrorService ) {
      this.http = http;
      this.errorService = errorService;
    }

    init(){
      this.initUser();
    }

//******************************************************************************
//REST CALLS********************************************************************
//******************************************************************************
    callLogin( user:User ) {
      let loggerMethod: string = ".callLogin";
      let body = "locale=fr_US&email=" + user.email + "&password=" + user.password;
      let headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      let options = new RequestOptions({
        headers: headers
      });
      return this.http.post( loginURL, body, options )
          .map( res => res.json() )
          .catch( this.errorService.handleCallError );
    }

    callDisconnect( mobileTokenSessionId: string) {
        let loggerMethod: string = ".callDisconnect";
        let body = "locale=fr_US";
        if (this.loggedUser && this.loggedUser.sessionToken){
          let sessionToken: string = this.loggedUser.sessionToken;
          body += "&sessionToken=" + sessionToken;
        }
        let headers = new Headers({
          'Content-Type': 'application/x-www-form-urlencoded'
        });
        let options = new RequestOptions({
          headers: headers
        });
        return this.http.post( disconnectURL, body, options )
            .map( res => res.json() )
            .catch( this.errorService.handleCallError );
    }
//******************************************************************************
//PUBLIC METHODS****************************************************************
//******************************************************************************
    login( user: User, successCallback: ( nav: any ) => void, errorCallback: ( errorMessage: Observable<string>, nav: any ) => void, component:any ) {
      let loggerMethod: string = ".login";
      let restMessage: RestMessage;
      this.callLogin(user).subscribe(
        //observable.next
        data => {
          restMessage = data;
        },
        //observable.error
        error => {
          errorCallback( this.errorService.handleSubscribeError( error, this._loggerHeader + loggerMethod), component );
        },
        //observable.complete
        () => {
          if(restMessage.status == "success") {
              this.loggedUser = restMessage.singleResult;
              successCallback(component);
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

    disconnect( user: User, successCallback: ( nav: any ) => void, errorCallback: ( errorMessage: Observable<string>, nav: any ) => void, component:any ) {
        console.log("session= " + this.loggedUser.sessionToken);
        let loggerMethod: string = ".disconnect";
        let restMessage: RestMessage;
        this.callDisconnect(user.sessionToken).subscribe(
          //observable.next
          data => {
            restMessage = data;
          },
          //observable.error
          error => {
            errorCallback( this.errorService.handleSubscribeError( error, this._loggerHeader + loggerMethod), component );
          },
          //observable.complete
          () => {
            if(restMessage.status == "success") {
                this.initUser();
                successCallback(component);
                //console.log("sessionFinale= " + this.loggedUser.sessionToken);
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
//******************************************************************************
//ERRORS HANDLING***************************************************************
//******************************************************************************

//******************************************************************************
//PRIVATE METHODS***************************************************************
//******************************************************************************
private initUser() {
  this.loggedUser = {
    "idUser": "",
    "firstName": "",
    "lastName": "",
    "email": "",
    "password": "",
    "sessionToken": ""
  };
}

}
