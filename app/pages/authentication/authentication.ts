import {IonicApp, ViewController, Page, Alert, MenuController, NavController} from 'ionic-angular';
import { FORM_DIRECTIVES, FormBuilder,  ControlGroup, Control, Validators, AbstractControl } from 'angular2/common';
import {HomePage} from '../home/home';
import {UserService} from '../../services/userService';
import {WkUser} from '../../models/wkUser';
import {Observable} from 'rxjs/Observable';

@Page({
    templateUrl: 'build/pages/authentication/authentication.html',
})

export class AuthenticationPage {
    loginForm: ControlGroup;
    email: AbstractControl;
    password: AbstractControl;

    constructor( private app: IonicApp, private nav: NavController, private viewController: ViewController, private menuController: MenuController, private formBuilder: FormBuilder, private userService: UserService ) {
        this.loginForm = formBuilder.group ({
            email: ['', Validators.compose([Validators.required, this.emailValidForm])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        });

        this.email = this.loginForm.controls['email'];
        this.password = this.loginForm.controls['password'];
    }

    onPageLoaded(){
        this.menuController.enable(false);
        this.viewController.showBackButton(false);
    }

    emailValidForm( control: Control ) {
        var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        if (control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
            return { "emailValidForm": true };
        }
        return null;
    }

    login( event ) {
        if( !this.loginForm.valid ) {
            //console.error( "form not valid" );
        } else {
            let user: WkUser = {
                "idUser":"",
                "email": this.loginForm.value.email,
                "password": this.loginForm.value.password,
                "firstName": "",
                "lastName": "",
                "sessionToken": ""
            };
            let successCallback = this.successPopup;
            let errorCallback = this.errorPopup;
            let callbackComponent = this.nav;
            this.userService.login( user, successCallback, errorCallback, callbackComponent );
        }
    }

    successPopup( nav: any ){
        let alert = Alert.create({
            title: "Login Success",
            message: "You are now able to access all you\'re online Data",
            buttons: [
                {
                    text:"ok",
                    handler: () => {
                        nav.setRoot(HomePage);
                    }
                }
            ]
        });
        nav.present(alert);
    }

    errorPopup(messageToDisplay: Observable<string>, nav: any){
        let message: string;
        messageToDisplay.subscribe(
            data => {
                message = data;
            },
            error => {
                //todo
            },
            () => {
                let alert = Alert.create({
                    title: 'Login Failed',
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

    onPageWillLeave() {
    }
}
