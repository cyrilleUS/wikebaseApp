
import {Injectable} from 'angular2/core';
import {Platform} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';

import {Contacts} from 'ionic-native';
import {WkContact} from '../models/wkContact';

@Injectable()
export class PhoneContactService {
    phoneContactList: Contact[] =[];
    private _loggerHeader: string = "error in phoneContactService";
    constructor (private platform: Platform){
        //
    }
    init(){
        let loggerMethod = ".init";
        this.platform.ready().then(
            () => {
                if (navigator.contacts){
                    navigator.contacts.find(['displayName'],
                    // On sucess
                    data => {
                        this.phoneContactList = data;
                    },
                    // On error
                    onerror => {
                        console.log( this._loggerHeader + loggerMethod + "platformReady ok , navigator.contacts ok but error in navigator.contacts.find");
                        let fakeContact: Contact = new Contact();
                        fakeContact.name.familyName  = "fakeFamily";
                        fakeContact.name.givenName  = "fakeFirstName";
                        this.phoneContactList.push(fakeContact);
                    // Options
                    });
                } else {
                    console.log(this._loggerHeader + loggerMethod + "platformReady ok, navigator.contacts null");
/*
                    let options: ContactProperties = {
                        "name": {
                            "familyName": "fakeFamily",
                            "givenName": "fakeFirstName"
                        }
                    };
                    let fakeContact =  Contacts.create(options);

                    this.phoneContactList.push(fakeContact);
*/
                }
            }
        );
    }
    getAllContact(){
        let loggerMethod = ".getAllContact";
        let observableOutput = Observable.create(
            observer => {
                try {

                    let output: Array<WkContact> = new Array(this.phoneContactList.length);
                    if (this.phoneContactList && (this.phoneContactList.length > 0)){
                        console.log(this._loggerHeader + loggerMethod + "this.phoneContactList && this.phoneContactList.length > 0");
                        this.phoneContactList.forEach(
                            (contact) => {
                                console.log(this._loggerHeader + loggerMethod + "pushing contacts in the for each loop");
                                output.push(this._convertIonicContactToWkContact(contact));
                            }
                        );
                    } else {
                        console.log(this._loggerHeader + loggerMethod + "creating fake contact");
                        let fakeContact: WkContact = {"idContact": "","firstName": "fakeFirstName","lastName": "fakeLastName","email": "","addressStreet": "","addressCity": "","addressState": "","addressCode": "","addressCountry": "", "mobileNumber": "", "phoneNumber": ""};
                        output = [fakeContact];
                    }
                    observer.next(output);
                    observer.complete();
                } catch (error){
                  observer.error(this._loggerHeader + loggerMethod+"SubscribeError-output"+error);
                }
                return () => {
                  //what we should do if we cancel the observable with dispose() or when an error is thrown

                }
            }
        );
        return observableOutput;
    }

    private _convertIonicContactToWkContact(input: Contact){
        let output: WkContact;
        output.firstName = (input.name && input.name.givenName)?input.name.givenName:"";
        output.lastName = (input.name && input.name.familyName)?input.name.familyName:"";
        output.email = (input.emails && input.emails[0].value)?input.emails[0].value:"";
        output.addressStreet = (input.addresses && input.addresses[0].streetAddress)?input.addresses[0].streetAddress:"";
        output.addressCity = (input.addresses && input.addresses[0].locality)?input.addresses[0].locality:"";
        output.addressState = (input.addresses && input.addresses[0].region)?input.addresses[0].region:"";
        output.addressCode = (input.addresses && input.addresses[0].postalCode)?input.addresses[0].postalCode:"";
        output.addressCountry = (input.addresses && input.addresses[0].country)?input.addresses[0].country:"";
        output.mobileNumber = (input.phoneNumbers && input.phoneNumbers[0].value)?input.phoneNumbers[0].value:"";
        output.phoneNumber = (input.phoneNumbers && input.phoneNumbers[1].value)?input.phoneNumbers[1].value:"";
        return output;
    }
}
