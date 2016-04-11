/*import 'es6-shim';*/
import {App, IonicApp, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {ContactDetailPage} from './pages/contact-detail/contact-detail';
import {ListContactPage} from './pages/list-contact/list-contact';
import {NewContactPage} from './pages/new-contact/new-contact';

@App({
  templateUrl: 'build/app.html',
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class MyApp {
  rootPage: any;
  pages: Array<{title: string, component: any}>;

  constructor(private app: IonicApp, private platform: Platform) {

    this.initializeApp();

    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Contact List', component: ListContactPage },
      { title: 'New Contact', component: NewContactPage }
    ];
    this.rootPage = HomePage;

  }
  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
    });
  }
  openPage(page) {
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);
  }
}
