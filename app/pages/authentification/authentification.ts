import {IonicApp, Page, Alert, MenuController} from 'ionic-angular';
import { FORM_DIRECTIVES, FormBuilder,  ControlGroup, Control, Validators, AbstractControl } from 'angular2/common';
import {HomePage} from '../home/home';
import {UserServices} from '../../services/userServices';
import {User} from '../../models/user';


@Page({
  templateUrl: 'build/pages/authentification/authentification.html',
})
export class AuthentificationPage {
  userServices: UserServices;
  loginForm: ControlGroup;
  email: AbstractControl;
  password: AbstractControl;
  menu: MenuController

  constructor(private app: IonicApp, userServices: UserServices, form: FormBuilder, menu: MenuController) {
    this.menu = menu;
    this.menu.enable(false);

    this.userServices = userServices;

    this.loginForm = form.group ({
      email: ['', Validators.compose([Validators.required, this.emailValidForm])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
    })

    this.email = this.loginForm.controls['email'];
    this.password = this.loginForm.controls['password'];
  }

  emailValidForm(c: Control) {
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

        if (c.value != "" && (c.value.length <= 5 || !EMAIL_REGEXP.test(c.value))) {
            return { "emailValidForm": true };
        }

        return null;
  }

  login(event) {
    if(!this.loginForm.valid) {
      console.error("form not valid");
    }
    else {
      let user: User = {
        "idUser":"",
        "email": this.loginForm.value.email,
        "password": this.loginForm.value.password,
        "firstName": "",
        "lastName": "",
        "sessionToken": ""
      };

      this.userServices.login(user, this.successPopup, this.app.getComponent("nav"), this.errorPopup);
    }
  }

  successPopup( nav: any ){
      let alert = Alert.create({
        title: "Login Success",
        message: "You are now able to access all you\'re online Data",
        buttons: [
          { text:"ok",
            handler: () => {
              nav.setPages([{page: HomePage }]);
            }
          }
        ]
      });
      nav.present(alert);
  }
  errorPopup(messageToDisplay: String, nav: any){
    let alert = Alert.create({
        title: 'Login Failed',
        message: ''+messageToDisplay,
        buttons: [
                { text:'Ok',
                  handler: () => {
                    //nav.setPages([{page: HomePage }]);
                  }
              }]
      });
    //let nav = this.app.getComponent("nav");
    nav.present(alert);
  }

  onPageWillLeave() {
    this.menu.enable(true);
  }
}
