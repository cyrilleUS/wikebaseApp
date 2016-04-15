import {Page, IonicApp, Alert} from 'ionic-angular';
import {ContactServices} from '../../services/contactServices';
import { FORM_DIRECTIVES, FormBuilder,  ControlGroup, Control, Validators, AbstractControl } from 'angular2/common';
import {HomePage} from '../home/home';
import {Contact} from '../../models/contact';

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

  constructor(contactServices: ContactServices, form: FormBuilder,  private app: IonicApp, editedContact: Contact) {
    this.contactServices = contactServices;
    this.editedContact = editedContact;

    this.contactForm = form.group ({
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      email: ['', Validators.compose([Validators.required, this.emailValidForm])],
      addressStreet: [''],
      addressCity:[''],
      addressState:[''],
      addressCode:[''],
      addressCountry:['']
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
        title: 'An Error Occured...',
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
      console.log("values:");
      console.log("firstName:"+this.contactForm.value.firstName);
      console.log("lastName:"+this.contactForm.value.lastName);
      console.log("email:"+this.contactForm.value.email);
      console.log("addressStreet:"+this.contactForm.value.addressStreet);
      console.log("addressCity:"+this.contactForm.value.addressCity);
      console.log("addressState:"+ this.contactForm.value.addressState);
      console.log("addressCode:"+this.contactForm.value.addressCode);
      console.log("addressCountry:"+this.contactForm.value.addressCountry);
      contact =
      {
        "idContact":id,
        "firstName":this.contactForm.value.firstName,
        "lastName":this.contactForm.value.lastName,
        "email": this.contactForm.value.email,
        "addressStreet": this.contactForm.value.addressStreet,
        "addressCity": this.contactForm.value.addressCity,
        "addressState": this.contactForm.value.addressState,
        "addressCode": this.contactForm.value.addressCode,
        "addressCountry": this.contactForm.value.addressCountry
      };

      this.contactServices.addContact( contact, this.successPopup, this.app.getComponent("nav"), this.errorPopup);
    }
  }

  cancel() {
    this.app.getComponent("nav").setRoot(HomePage);
  }
}
