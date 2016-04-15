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
    init(){
      this.initUser();
    }

//******************************************************************************
//REST CALLS********************************************************************
//******************************************************************************
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
//******************************************************************************
//PUBLIC METHODS****************************************************************
//******************************************************************************
    login( user: User, successCallback: ( nav: any ) => void, errorCallback: ( errorMessage: Observable<string>, nav: any ) => void, component:any ) {
      let loggerMethod: string = ".login";
      let restMessage: RestMessage;
      this.callLogin( user ).subscribe(
        //observable.next
        data => {
          restMessage = data;
        },
        //observable.error
        error => {
          console.error( loggerHeader + loggerMethod + "error subscribing restMessage" + error);
          //errorCallback("internal error or connection aborted",nav);
        },
        //observable.complete
        () => {
        if(restMessage.status == "success") {
            this.loggedUser = restMessage.singleResult;
            successCallback(component);
        }else if ( restMessage.status == "failure" ){
          //let errorMessage = this.handleRestMessageError( restMessage.errors, loggerMethod);
          errorCallback( this.handleRestMessageError( restMessage.errors, loggerMethod), component );
        }else{
          let errorMessage = "restMessageStatus undefinied: bad request";
          console.error( loggerHeader + loggerMethod + errorMessage);
          //errorCallback("the server did not respond correctly",nav);
        }
      }
      );
    }
    deleteLoggedUser() {


      this.initUser();
    }
//******************************************************************************
//ERRORS HANDLING***************************************************************
//******************************************************************************
    handleCallError(error) {
        console.error( error );
        return Observable.throw( error.json().error || 'Server error' );
    }
    handleRestMessageError(restErrors: RestErrors, loggerMethod: string){
      loggerMethod += ".handleRestMessageError";
      let outputErrorMessage : string = "";
      let fieldErrors: Array<FieldError>;
      let globalErrors: Array<GlobalError>;
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
      return Observable.create(observer => {
              observer.next(outputErrorMessage);
              observer.complete();
              });
    }
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
