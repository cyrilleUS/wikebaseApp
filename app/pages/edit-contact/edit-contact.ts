import {IonicApp, Modal, Platform, NavController, NavParams, Page, ViewController, Alert} from 'ionic-angular';
import {ContactServices} from '../../services/contactServices';
import {Toast} from 'ionic-native';
import { FORM_DIRECTIVES, FormBuilder,  ControlGroup, Control, Validators, AbstractControl } from 'angular2/common';
import {HomePage} from '../home/home';
import {ListContactPage} from '../list-contact/list-contact';
import {Contact} from '../../models/contact';
import {Observable} from 'rxjs/Observable';

@Page({
  templateUrl: 'build/pages/edit-contact/edit-contact.html'
})
export class EditContactPage {
  contactForm: ControlGroup;
  firstName: AbstractControl;
  lastName: AbstractControl;
  email: AbstractControl;
  contact: Contact;

  constructor( private app: IonicApp, private nav: NavController, private navParams: NavParams, private viewController: ViewController, private formBuilder: FormBuilder, private contactServices: ContactServices ) {

    this.contact = navParams.get('contact');
    this.contactForm = formBuilder.group ({
      firstName: [this.contact.firstName, Validators.compose([Validators.required, Validators.minLength(3)])],
      lastName: [this.contact.lastName, Validators.compose([Validators.required, Validators.minLength(3)])],
      email: [this.contact.email, Validators.compose([Validators.required, this.emailValidForm])],
      addressStreet: [this.contact.addressStreet],
      addressCity:[this.contact.addressCity],
      addressState:[this.contact.addressState],
      addressCode:[this.contact.addressCode],
      addressCountry:[this.contact.addressCountry],
      mobileNumber:[this.contact.mobileNumber],
      phoneNumber:[this.contact.phoneNumber]
    });
    this.firstName = this.contactForm.controls['firstName'];
    this.lastName = this.contactForm.controls['lastName'];
    this.email = this.contactForm.controls['email'];

    this.contactForm.value.firstName = this.contact.firstName;

  }
  initForm(){

  }
  emailValidForm(c: Control) {
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

        if (c.value != "" && (c.value.length <= 5 || !EMAIL_REGEXP.test(c.value))) {
            return { "emailValidForm": true };
        }

        return null;
  }

  onPageLoaded(){
    //to do when we load the page the first time
    //works the same as ngOnInit
  }
  onPageWillEnter() {
    /*to do just before the display of the page*/
  }
  onPageDidEnter(){}
  onPageWillLeave() {
    /*to do just before the page is leaved*/
  }
  onPageDidLeave() {}
  onPageWillUnload() {}
  onPageDidUnload() {}

  successPopup(app: any){
    /*cordova plugin add cordova-plugin-x-toast
    Toast.show("Contact saved", "5000", "bottom").subscribe(
      toast => {
        console.log(toast);
      }
    ); Native component, got to test with emulator or device.*/

    let loading = app.getComponent("loading");
    loading.show();
    setTimeout(() => {
      loading.hide();
      app.getComponent("nav").setRoot(ListContactPage);
    }, 2000);
    //nav.present(loading);
  }


  successDeletePopup(nav: any){
    let alert = Alert.create({
        title: 'Contact Deleted',
        message: "Your contact has been deleted !",
        buttons: [
                { text:'Ok',
                  handler: () => {
                    nav.setRoot(ListContactPage);
                  }
              }]
      });
    nav.present(alert);

  }


  errorPopup(messageToDisplay: Observable<string>, nav: any){
    let message: string;
    messageToDisplay.subscribe(
      //
      data => {
        message = data;
      }, error => {
        //todo
      }, () => {
        let alert = Alert.create(
          {
            title: 'Editing Contact Failed',
            message: ''+ message,
            buttons: [
              {
                text:'Ok',
                handler: () => {
                  //do nothing on complete
                }
              }
            ]
          });
          nav.present(alert);
        }
      );
  }

  editContact(event) {
    if(!this.contactForm.valid) {
      console.log("form not valid");
    }
    else {
      let contact: Contact;
      let id = "";
      contact =
      {
        "idContact":this.contact.idContact,
        "firstName":this.contactForm.value.firstName,
        "lastName":this.contactForm.value.lastName,
        "email": this.contactForm.value.email,
        "addressStreet": this.contactForm.value.addressStreet,
        "addressCity": this.contactForm.value.addressCity,
        "addressState": this.contactForm.value.addressState,
        "addressCode": this.contactForm.value.addressCode,
        "addressCountry": this.contactForm.value.addressCountry,
        "mobileNumber": this.contactForm.value.mobileNumber,
        "phoneNumber": this.contactForm.value.phoneNumber
      };
      let successCallback = this.successPopup;
      let errorCallback = this.errorPopup;
      let successCallbackComponent = this.app;
      let errorCallbackComponent = this.nav;
      this.contactServices.editContact( contact, successCallback, errorCallback, successCallbackComponent, errorCallbackComponent);
    }
  }

  cancel() {
    this.viewController.dismiss();
  }

  public delete(){
    let alert = Alert.create(
      {
        title: 'Delete Contact',
        message: "Sure?",
        buttons: [
          {
            text:'Yes',
            handler: () => {
              let successCallback = this.successDeletePopup;
              let errorCallback = this.errorPopup;
              let callbackComponent = this.nav;
              this.contactServices.deleteContact( this.contact, successCallback, errorCallback, callbackComponent);
            }
          },
          {
            text:'No',
            handler: () => {
              //do nothing on complete
            }
          }
        ]
      });
      this.nav.present(alert);
    }


}
