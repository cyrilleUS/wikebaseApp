import {Page} from 'ionic-angular';


@Page({
  templateUrl: 'build/pages/new-contact/new-contact.html'
})
export class NewContactPage {
  constructor() {

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
}
