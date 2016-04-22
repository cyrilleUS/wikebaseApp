/// <reference path="../../typings/cordova-contacts.d.ts" />

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
                    alert("Contacts available");
                    //let options: ContactFindOptions  = new ContactFindOptions();
                    //options.filter   = "";
                    //options.multiple = true;
                    //let fields       = ["displayName"];
                    //navigator.contacts.find(fields, this._successFindContact, this._errorFindContact, options);
                    var options:any = {};
                    options.multiple = true;
                    Contacts.find(['*'],options).then(
                        (contacts) => { this._successFindContact(contacts); }
                    );
                    alert("Executed find contacts");
                } else {
                    alert("Contacts not available");
                    throw "platfrom ready but navigator.contacts not supported";
                }
            }
        );
    }
    getAllContact(){
        let loggerMethod = ".getAllContact";
        let observableOutput = Observable.create(
            observer => {
                try {

                    let output: Array<WkContact> = new Array();
                    if (this.phoneContactList && (this.phoneContactList.length > 0)){
                        console.log(this._loggerHeader + loggerMethod + "this.phoneContactList && this.phoneContactList.length > 0");
                        this.phoneContactList.forEach(
                            (contact) => {
                                console.log(this._loggerHeader + loggerMethod + "pushing contacts in the for each loop");
                                output.push(this._convertIonicContactToWkContact(contact));
                            }
                        );
                        alert("First contact is "+output[0].firstName+" "+output[0].lastName);
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
        try {
            let output: WkContact = {"idContact": "","firstName": "convertFn","lastName": "convertLn","email": "","addressStreet": "","addressCity": "","addressState": "","addressCode": "","addressCountry": "", "mobileNumber": "", "phoneNumber": ""};
            output.firstName = (input.name && input.name.givenName)?input.name.givenName:"not found";
            output.lastName = (input.name && input.name.familyName)?input.name.familyName:"not found";
            output.email = (input.emails && input.emails[0].value)?input.emails[0].value:"not found";
            output.addressStreet = (input.addresses && input.addresses[0].streetAddress)?input.addresses[0].streetAddress:"not found";
            output.addressCity = (input.addresses && input.addresses[0].locality)?input.addresses[0].locality:"not found";
            output.addressState = (input.addresses && input.addresses[0].region)?input.addresses[0].region:"not found";
            output.addressCode = (input.addresses && input.addresses[0].postalCode)?input.addresses[0].postalCode:"not found";
            output.addressCountry = (input.addresses && input.addresses[0].country)?input.addresses[0].country:"not found";
            output.mobileNumber = (input.phoneNumbers && input.phoneNumbers[0].value)?input.phoneNumbers[0].value:"not found";
            output.phoneNumber = (input.phoneNumbers && input.phoneNumbers[1] && input.phoneNumbers[1].value)?input.phoneNumbers[1].value:"not found";
            return output;
        }
        catch(error) {
            alert("Failed to convert");
            throw("error in convert: " + error);
        }
    }

    private _successFindContact(contacts){
        alert("found contacts: "+contacts);
        this.phoneContactList = contacts;
    }

    private _errorFindContact(){
        alert("Cound not find contacts");
        throw "error find contact";
    }
}
