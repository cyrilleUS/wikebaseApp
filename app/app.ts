import {App, IonicApp, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
//import {$WebSocket} from 'angular2-websocket/angular2-websocket';

import {HomePage} from './pages/home/home';
import {ContactDetailPage} from './pages/contact-detail/contact-detail';
import {ListContactPage} from './pages/list-contact/list-contact';
import {NewContactPage} from './pages/new-contact/new-contact';
import {AuthenticationPage} from './pages/authentication/authentication';
import {LoadingModal} from './components/loading-modal/loading-modal';
import {ContactService} from './services/contactService';
import {UserService} from './services/userService';
import {ErrorService} from './services/errorService';
import {PhoneContactService} from './services/phoneContactService';
import {ExceptionHandler} from 'angular2/core';
import {provide} from 'angular2/core';

class MyExceptionHandler extends ExceptionHandler {
   call(error, stackTrace = null, reason = null) {
       // do something with the exception
       alert("error="+error+" / stackTrace="+stackTrace+" / reason="+reason);
   }
}

@App({
  templateUrl: 'build/app.html',
  config: {
        scrollAssist: false,
        autoFocusAssist: false
    }, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [ContactService, UserService, ErrorService, PhoneContactService, provide(ExceptionHandler, {useClass:MyExceptionHandler})],
  directives: [LoadingModal]
})


export class MyApp {
  rootPage: any;
  pages: Array<{title: string, component: any}>;

  constructor(private app: IonicApp, private platform: Platform, private contactService: ContactService, private userService: UserService, private errorService: ErrorService, private phoneContactService: PhoneContactService) {

    this.initializeApp();

    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Contact List', component: ListContactPage },
      { title: 'New Contact', component: NewContactPage }
    ];
    this.rootPage = AuthenticationPage;

  }

  initializeApp() {
    this.platform.ready().then(
      () => {
        StatusBar.styleDefault();
      }
    );
    this.userService.init();
    this.phoneContactService.init();
  }

  openPage(page) {
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);
  }
}
