import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {RestErrors} from '../models/restErrors';
import {FieldError} from '../models/fieldError';
import {GlobalError} from '../models/globalError';

@Injectable()
export class ErrorService{
  constructor () {
  }

  handleCallError(error) {
      console.error( "handleCallError" + error );
      return Observable.throw( "jsonError"+error.json().error || 'Call error' );
  }
  handleSubscribeError(error, loggerStack: string){
    loggerStack += ".handleSubscribeError";
    console.error( loggerStack + "error subscribing restMessage" + error);
    let observableErrorMessage = Observable.create(
      observer => {
        try {
            observer.next(loggerStack+"Subscribe error:"+ error);
            observer.complete();
        } catch (error){
          observer.error(loggerStack+"SubscribeError-output"+error);
        }
        return () => {
          //what we should do if we cancel the observable with dispose() or when an error is thrown

        }
      }
    );
    return observableErrorMessage;
  }
  handleRestMessageError(restErrors: RestErrors, loggerStack: string){
    loggerStack += ".restMessageError";
    let outputErrorMessage : string = "RestMessageError-";
    let fieldErrors: Array<FieldError>;
    let globalErrors: Array<GlobalError>;
    if ( restErrors.fieldErrors && ( restErrors.fieldErrors.length != 0 ) ){
      fieldErrors = restErrors.fieldErrors;
      fieldErrors.forEach(
          (data) => {
            outputErrorMessage += data.fieldName;
            outputErrorMessage += ": "
            outputErrorMessage += data.userErrorMessage;
            console.log( loggerStack + " fieldError: " + data.technicalErrorMessage );
          }
      );
    }else if( restErrors.globalErrors && ( restErrors.globalErrors.length != 0 ) ){
        globalErrors = restErrors.globalErrors;
        globalErrors.forEach(
            (data) => {
              outputErrorMessage += data.userErrorMessage;
              console.log( loggerStack + " globalError: " + data.technicalErrorMessage + " " + data.technicalErrorDetails );
            }
        );
    }else{
      outputErrorMessage += "no detail to display";
      console.log( loggerStack + "EmptyErrors: " + restErrors.empty );
    }

    let observableErrorMessage = Observable.create(
      observer => {
        try {
            observer.next(outputErrorMessage);
            observer.complete();
        } catch (error){
          observer.error(loggerStack+"RestMessageError-output"+error);
        }
        return () => {
          //what we should do if we cancel the observable with dispose() or when an error is thrown
        }
      }
    );
    return observableErrorMessage;
  }
  handleUndefinedRestMessageError(loggerStack: string){
    loggerStack += ".undefinedRestMessageError";
    console.error( loggerStack +  "the server did not respond correctly" );
    let observableErrorMessage = Observable.create(
      observer => {
        try {
            observer.next("the server did not respond correctly");
            observer.complete();
        } catch (error){
          observer.error(loggerStack+"undefinedRestMessage-output"+error);
        }
        return () => {
          //what we should do if we cancel the observable with dispose() or when an error is thrown
        }
      }
    );
    return observableErrorMessage;
  }
}
