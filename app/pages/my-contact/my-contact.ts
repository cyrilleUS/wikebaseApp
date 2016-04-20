/// <reference path="../../../typings/cordova-contacts.d.ts" />
// *****************************************************************
// Warning, all the contact object use in this page are the contacts from the cordova-plugin-contacts.
// *****************************************************************

import {Page, Alert, IonicApp, ViewController} from 'ionic-angular';
import {NewContactPage} from '../new-contact/new-contact';

@Page({
  templateUrl: 'build/pages/my-contact/my-contact.html'
})
export class MyContactPage {

    searchQuery: string;
    contactList: any;

    constructor(private app: IonicApp, private viewController: ViewController) {
        this.searchQuery = '';
        this.getAllContact();
    }

    getAllContact() {
        navigator.contacts.find(['displayName'],
        // On sucess
        allContacts => {
            this.contactList = allContacts;
            this.debugAlert("get all contact sucess", 'Found ' + allContacts.length + ' contacts.');
        },
        // On error
        onerror => {
            this.debugAlert("get all contact fail", "");
        // Options
        });
    }

    getContact() {
        let options = new ContactFindOptions( );

        options.filter =  this.searchQuery;  //leaving this empty will find return all contacts

        options.multiple = true;  //return multiple results

        let filter = ["displayName"];

        navigator.contacts.find(filter,
        // On sucess
        allContacts => {
            this.contactList = allContacts;
            this.debugAlert("get contact sucess", "search:"+this.searchQuery+'. Found ' + allContacts.length + ' contacts.');
        },
        // On error
        onerror => {
            this.debugAlert("get contact fail", "search:"+this.searchQuery);
        // Options
    }, options);
    }

    addContact(cordovaContact: Contact) {
        // Push to New Contact page
        this.debugAlert("Add contact", cordovaContact.name.givenName);
        this.cancel();
        this.app.getComponent("nav").setRoot(NewContactPage, {
            firstName : cordovaContact.name.givenName,
            lastName : cordovaContact.name.familyName,
            streetAddress : cordovaContact.addresses[0].streetAddress,
            streetCity : cordovaContact.addresses[0].locality,
            streetState : cordovaContact.addresses[0].region,
            streetCode : cordovaContact.addresses[0].postalCode,
            streetCountry : cordovaContact.addresses[0].country,
            phoneNumbers : cordovaContact.phoneNumbers[0].value,
            email : cordovaContact.emails[0].value
        });
    }

    cancel() {
      this.viewController.dismiss();
    }

    debugAlert(title: string, message: string) {
        let alert = Alert.create({
          title: title,
          message: message,
          buttons: [
            { text:"ok"}
          ]
        });
        this.app.getComponent("nav").present(alert);
    }
}
