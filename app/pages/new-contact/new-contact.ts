import {IonicApp, NavController, ViewController, Alert, Page} from 'ionic-angular';
import {ContactServices} from '../../services/contactServices';
import { FORM_DIRECTIVES, FormBuilder,  ControlGroup, Control, Validators, AbstractControl } from 'angular2/common';
import {HomePage} from '../home/home';
import {Contact} from '../../models/contact';

@Page({
  templateUrl: 'build/pages/new-contact/new-contact.html'
})
export class NewContactPage {
  contactForm: ControlGroup;
  firstName: AbstractControl;
  lastName: AbstractControl;
  email: AbstractControl;

  constructor( private app: IonicApp, private nav: NavController, private viewController: ViewController, private contactServices: ContactServices, private formBuilder: FormBuilder ) {

    this.contactForm = formBuilder.group ({
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

  emailValidForm( control: Control ) {
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
      return { "emailValidForm": true };
    }
    return null;
  }
  onPageLoaded(){
    this.viewController.showBackButton(false);
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

  successPopup( messageToDisplay: String, nav: any ){
    let alert = Alert.create({
        title: 'Contact Saved',
        message: ''+messageToDisplay,
        buttons: [
                { text:'Ok',
                  handler: () => {
                    nav.setPages( [
                      {page: HomePage}
                    ] );
                  }
              }]
      });
    nav.present(alert);
  }
  errorPopup( messageToDisplay: String, nav: any ){
    let alert = Alert.create({
        title: 'An Error Occured...',
        message: ''+messageToDisplay,
        buttons: [
                { text:'Ok',
                  handler: () => {
                    nav.setPages( [
                      {page: HomePage }
                    ]);
                  }
              }]
      });
    nav.present(alert);
  }

  addNewContact( event ) {
    if( !this.contactForm.valid ) {
      this.errorPopup( "invalid form", this.nav );
    }
    else {
      let contact: Contact;
      let id = "" + ( this.contactServices.getContactListSize() + 1 );
      contact =
      {
        "idContact": id,
        "firstName": this.contactForm.value.firstName,
        "lastName": this.contactForm.value.lastName,
        "email": this.contactForm.value.email,
        "addressStreet": this.contactForm.value.addressStreet,
        "addressCity": this.contactForm.value.addressCity,
        "addressState": this.contactForm.value.addressState,
        "addressCode": this.contactForm.value.addressCode,
        "addressCountry": this.contactForm.value.addressCountry
      };
      let successCallback = this.successPopup;
      let errorCallback = this.errorPopup;
      let callbackComponent = this.nav;
      this.contactServices.addContact( contact, successCallback, errorCallback, callbackComponent );
    }
  }

  cancel() {
    if ( this.nav.canGoBack() ){
        this.nav.pop();
    }else{
        this.nav.push(HomePage);
    }

  }
}
