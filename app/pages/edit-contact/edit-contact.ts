import {Page, IonicApp, Alert, NavParams} from 'ionic-angular';
import {ContactServices} from '../../services/contactServices';
import { FORM_DIRECTIVES, FormBuilder,  ControlGroup, Control, Validators, AbstractControl } from 'angular2/common';
import {HomePage} from '../home/home';
import {Contact} from '../../models/contact';
import {Observable} from 'rxjs/Observable';

@Page({
  templateUrl: 'build/pages/edit-contact/edit-contact.html'
})
export class EditContactPage {
  contactServices: ContactServices;
  contactForm: ControlGroup;
  firstName: AbstractControl;
  lastName: AbstractControl;
  email: AbstractControl;
  editedContact: Contact;

  constructor(contactServices: ContactServices, form: FormBuilder,  private app: IonicApp, navParams: NavParams) {
    this.contactServices = contactServices;
    this.editedContact = navParams.get('contact');

    this.contactForm = form.group ({
      firstName: [this.editedContact.firstName, Validators.compose([Validators.required, Validators.minLength(3)])],
      lastName: [this.editedContact.lastName, Validators.compose([Validators.required, Validators.minLength(3)])],
      email: [this.editedContact.email, Validators.compose([Validators.required, this.emailValidForm])],
      addressStreet: [this.editedContact.addressStreet],
      addressCity:[this.editedContact.addressCity],
      addressState:[this.editedContact.addressState],
      addressCode:[this.editedContact.addressCode],
      addressCountry:[this.editedContact.addressCountry]
    })

    this.firstName = this.contactForm.controls['firstName'];
    this.lastName = this.contactForm.controls['lastName'];
    this.email = this.contactForm.controls['email'];

    this.contactForm.value.firstName = this.editedContact.firstName;

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

  successPopup(nav: any){
    let alert = Alert.create({
        title: 'Contact Saved',
        message: "Your contact edit succeed !",
        buttons: [
                { text:'Ok',
                  handler: () => {
                    nav.setPages([{page: HomePage }]);
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
        "idContact":this.editedContact.idContact,
        "firstName":this.contactForm.value.firstName,
        "lastName":this.contactForm.value.lastName,
        "email": this.contactForm.value.email,
        "addressStreet": this.contactForm.value.addressStreet,
        "addressCity": this.contactForm.value.addressCity,
        "addressState": this.contactForm.value.addressState,
        "addressCode": this.contactForm.value.addressCode,
        "addressCountry": this.contactForm.value.addressCountry
      };
      let successCallback = this.successPopup;
      let errorCallback = this.errorPopup;
      let callbackComponent = this.app.getComponent("nav");
      this.contactServices.editContact( contact, successCallback, errorCallback, callbackComponent);
    }
  }

  cancel() {
    this.app.getComponent("nav").setRoot(HomePage);
  }
}
