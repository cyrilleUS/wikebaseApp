import {IonicApp, Platform, Page, Alert, MenuController, NavController} from 'ionic-angular';
import { FORM_DIRECTIVES, FormBuilder,  ControlGroup, Control, Validators, AbstractControl } from 'angular2/common';

import {WebSocketService} from '../../services/webSocketService';
import {ChatMessage} from '../../models/chatMessage';

@Page({
    templateUrl: 'build/pages/webSocket-test/webSocket-test.html',
})

export class WebSocketTestPage {
    loginForm: ControlGroup;
    email: AbstractControl;
    password: AbstractControl;

    constructor( private app: IonicApp, private platform: Platform, private nav: NavController, private webSocketService: WebSocketService ) {
        platform.ready().then(() => {
             // this.webSocketService.connect();
             // alert(this.webSocketService.getData());
             // this.webSocketService.send();
            });
    }

    onPageLoaded(){
        let m : ChatMessage = new ChatMessage("toto","titi");
        alert (m.author);

    }


    onPageWillLeave() {
    }
}
