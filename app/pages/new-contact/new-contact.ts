import {Page, IonicApp, Alert} from 'ionic-angular';
import {ContactServices} from '../../services/contactServices';
import { FORM_DIRECTIVES, FormBuilder,  ControlGroup, Control, Validators, AbstractControl } from 'angular2/common';
import {HomePage} from '../home/home';
import {Contact} from '../../models/contact';

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

  successPopup(messageToDisplay: String, nav: any){
    let alert = Alert.create({
        title: 'Contact Saved',
        message: ''+messageToDisplay,
        buttons: [
                { text:'Ok',
                  handler: () => {
                    nav.setPages([{page: HomePage }]);
                  }
              }]
      });
    //let nav = this.app.getComponent("nav");
    nav.present(alert);
  }
  errorPopup(messageToDisplay: String, nav: any){
    let alert = Alert.create({
        title: 'Error',
        message: ''+messageToDisplay,
        buttons: [
                { text:'Ok',
                  handler: () => {
                    nav.setPages([{page: HomePage }]);
                  }
              }]
      });
    //let nav = this.app.getComponent("nav");
    nav.present(alert);
  }

  addNewContact(event) {
    if(!this.contactForm.valid) {
      console.log("form not valid");
    }
    else {
      let contact: Contact;
      let id = ""+this.contactServices.getContactListSize()+1;
      contact =
      {
        "id":id,
        "firstName":this.contactForm.value.firstName,
        "lastName":this.contactForm.value.lastName,
        "email": this.contactForm.value.email,
        "addressStreet": this.contactForm.value.addressStreet,
        "addressCity": this.contactForm.value.addressState,
        "addressState": this.contactForm.value.addressState,
        "addressCode": this.contactForm.value.addressCode,
        "addressCountry": this.contactForm.value.addressCountry
      };

      //let messageToDisplay = "";
      this.contactServices.addContact( contact, this.successPopup, this.app.getComponent("nav"), this.errorPopup);
      //console.log('in new-contact, messageToDisplay:'+messageToDisplay);

      /*
          //let resJSON: JSON = res;
          console.log("res="+res);
          //this.contactServices.addLocalContact(res);
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
        },
        error => {
          console.log("Error="+error)
          let alert = Alert.create({
              title: 'Errors',
              message: 'There was an error with the server',
              buttons: [
                      { text:'Ok'
                    }]
            });
          let nav = this.app.getComponent("nav");
          nav.present(alert);
        }
      )*/
    }
  }
}
