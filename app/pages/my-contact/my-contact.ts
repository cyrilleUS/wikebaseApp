/// <reference path="../../../typings/cordova-contacts.d.ts" />
// *****************************************************************
// Warning, all the contact object use in this page are the contacts from the cordova-plugin-contacts.
// *****************************************************************

import {Page, Alert, IonicApp} from 'ionic-angular';
import {NewContactPage} from '../new-contact/new-contact';

@Page({
  templateUrl: 'build/pages/my-contact/my-contact.html'
})
export class MyContactPage {

    searchQuery: string;
    contactList: Contact[];

    constructor(private app: IonicApp) {
        this.searchQuery = '';
        this.getAllContact();
    }

    getAllContact() {
        navigator.contacts.find(['displayName'],
        // On sucess
        allContacts => {
            this.contactList = allContacts;
        },
        // On error
        onerror => {
            let alert = Alert.create({
              title: "No results",
              message: "There are no contacts with this name on your phone.",
              buttons: [
                { text:"ok"}
              ]
            });
        // Options
        });
    }

    getContact(searchbar) {
        this.getAllContact();
        let search: string = searchbar.value;
        if(search.trim() != '') {
            this.contactList.filter((contact) => {
                if(contact.name.formatted.toLowerCase().indexOf(contact.name.formatted.toLowerCase()) > -1) {
                    return true;
                }
                return false;
            });
        }
        else {
            return;
        }

    }

    AddContact(cordovaContact: Contact) {
        // Push to New Contact page
        this.app.getComponent("nav").setRoot(NewContactPage, {
            contactFirstName: cordovaContact.name.givenName,
            contactLastName: cordovaContact.name.familyName,
            contactAddressStreet : cordovaContact.addresses[0].streetAddress,
            contactAddressCity : cordovaContact.addresses[0].locality,
            contactAddressState : cordovaContact.addresses[0].region,
            contactAddressCode : cordovaContact.addresses[0].postalCode,
            contactAddressCountry : cordovaContact.addresses[0].country
        })
    }
}
