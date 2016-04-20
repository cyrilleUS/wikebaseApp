import {App, IonicApp, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {ContactDetailPage} from './pages/contact-detail/contact-detail';
import {ListContactPage} from './pages/list-contact/list-contact';
import {NewContactPage} from './pages/new-contact/new-contact';
import {AuthentificationPage} from './pages/authentification/authentification';
import {LoadingModal} from './components/loading-modal/loading-modal';
import {ContactServices} from './services/contactServices';
import {UserServices} from './services/userServices';
import {ErrorService} from './services/errorService';
import {Contact} from './models/contact';


@App({
  templateUrl: 'build/app.html',
  config: {
        scrollAssist: false,
        autoFocusAssist: false
    }, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [ContactServices, UserServices, ErrorService],
  directives: [LoadingModal]
})

export class MyApp {
  rootPage: any;
  pages: Array<{title: string, component: any}>;
  contactServices: ContactServices;
  userServices: UserServices;
  errorService: ErrorService;

  constructor(private app: IonicApp, private platform: Platform, contactServices: ContactServices, userServices: UserServices, errorService: ErrorService) {

    this.contactServices = contactServices;
    this.userServices = userServices;
    this.errorService = errorService;

    this.initializeApp();

    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Contact List', component: ListContactPage },
      { title: 'New Contact', component: NewContactPage }
    ];
    this.rootPage = AuthentificationPage;

  }

  initializeApp() {
    this.platform.ready().then(
      () => {
        StatusBar.styleDefault();
      }
    );
    this.userServices.init();
  }

  openPage(page) {
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);
  }
}
