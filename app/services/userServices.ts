import {Injectable} from 'angular2/core';
import {User} from '../models/user';
import {Observable} from 'rxjs/Observable';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {RestMessage} from '../models/restMessage';
import {RestErrors} from '../models/restErrors';
import {FieldError} from '../models/fieldError';
import {GlobalError} from '../models/globalError';
import 'rxjs/Rx';

let favorites = [],
    loginURL = "http://local.uniquesound.com/mobileApp/MobileAppUserCross" + '/login',
    loggerHeader = "error in userServices";;

@Injectable()
export class UserServices {
    loggedUser: User;
    http: Http;

    constructor ( http: Http ) {
      this.http = http;
    }

    getUserForLogin() {
      return Observable.create(observer => {
          observer.next(this.loggedUser);
          observer.complete();
      });
    }

    init() {
      //nothing to do
    }

    callLogin( user:User ) {
      console.log("callLogin, user.email="+user.email+", user.password="+user.password);
      let body = "locale=fr_US&email=" + user.email + "&password=" + user.password;
      let headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      let options = new RequestOptions({
        headers: headers
      });
      return this.http.post( loginURL, body, options )
          .map( res => res.json() )
          .catch( this.handleCallError );
    }
    login( user: User, successCallback: ( nav: any ) => void, nav:any, errorCallback: ( errorMessage: string, nav: any ) => void ) {
      let loggerMethod: string = ".login";
      let restMessage: RestMessage;
      this.callLogin( user ).subscribe(
        data => {
          restMessage = data;
          if(restMessage.status == "success") {
              this.loggedUser = restMessage.singleResult;
              successCallback(nav);
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
            let errorMessage = "restMessageStatus undefinied: bad request";
            console.error( loggerHeader + loggerMethod + errorMessage);
            errorCallback("the server did not respond correctly",nav);
          }

        },
        error => {
          console.error( loggerHeader + loggerMethod + "error subscribing restMessage" );
          errorCallback("internal error or connection aborted",nav);
        }
      );
    }

    handleCallError(error) {
        console.error( error );
        return Observable.throw( error.json().error || 'Server error' );
    }

    deleteLoggedUser() {
      let user: User = {
        "idUser": "",
        "firstName": "",
        "lastName": "",
        "email": "",
        "password": "",
        "sessionToken": ""
      };
      this.loggedUser = user;
    }
}
//good: "id":1554,
