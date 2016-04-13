import {Page, IonicApp, Alert} from 'ionic-angular';
import {ContactServices} from '../../services/contactServices';
import { FORM_DIRECTIVES, FormBuilder,  ControlGroup, Control, Validators, AbstractControl } from 'angular2/common';
import {HomePage} from '../home/home';

@Page({
  templateUrl: 'build/pages/new-contact/new-contact.html'
})
export class NewContactPage {
  contactServices: ContactServices;
  contactForm: ControlGroup;
  firstName: AbstractControl;
  lastName: AbstractControl;
  email: AbstractControl;

  constructor(contactServices: ContactServices, form: FormBuilder,  private app: IonicApp) {
    this.contactServices = contactServices;

    this.contactForm = form.group ({
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      email: ['', Validators.compose([Validators.required, this.emailValidForm])],
    })

    this.firstName = this.contactForm.controls['firstName'];
    this.lastName = this.contactForm.controls['lastName'];
    this.email = this.contactForm.controls['email'];

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



  addNewContact(event) {
    if(!this.contactForm.valid) {

    }
    else {
      let id = this.contactServices.contactList.length;
      this.contactServices.addNewContact(id, this.contactForm.value.firstName, this.contactForm.value.lastName, this.contactForm.value.email, this.contactForm.value.addressStreet, this.contactForm.value.addressCity, this.contactForm.value.addressState, this.contactForm.value.addressCode, this.contactForm.value.addressCountry);
      let alert = Alert.create({
          title: 'New Contact Save',
          message: 'Your contact has been saved',
          buttons: [
                  { text:'Ok',
                    handler: () => {
                      nav.setPages([{page: HomePage }]);
                    }
                }]
        });
      let nav = this.app.getComponent("nav");
      nav.present(alert);
    }
  }
}
