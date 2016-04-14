import {Injectable} from 'angular2/core';
import {User} from '../models/user';
import {Observable} from 'rxjs/Observable';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {RestMessage} from '../models/restMessage';
import 'rxjs/Rx';

let favorites = [],
    loginURL = "http://local.uniquesound.com/mobileApp/MobileAppUserCross" + '/login';

@Injectable()
export class UserServices {
    loggedUser: User;
    http: Http;

    constructor (http: Http) {
      this.http = http;
    }

    getUserForLogin() {
      return Observable.create(observer => {
          observer.next(this.loggedUser);
          observer.complete();
      });
    }

    init() {

    }

    callLogin(user:User) {
      console.log("callLogin, user.email="+user.email+", user.password="+user.password);
      let body = "locale=fr_US&email=" + user.email + "&password=" + user.password;
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(loginURL, body, options)
          .map(res => res.json())
          .catch(this.handleError);
    }

    login(user: User, callBack: (message: String,nav:any)=>void, nav:any) {
      let restMessage: RestMessage;
      this.callLogin(user).subscribe(
        data => {
          restMessage = data;
          console.log("restMessage recieved: status:"+restMessage.status);
          if(restMessage.status == "success") {
              console.log("it's a success");
              console.log(restMessage.singleResult);
              this.loggedUser = restMessage.singleResult;
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

    handleError(error) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
