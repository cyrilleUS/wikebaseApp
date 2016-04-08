import {Page} from 'ionic-angular';


@Page({
  templateUrl: 'build/pages/home/home.html',
})

export class Home {
  categories:any[];
  searchCategories: any;
  currentCategory: any = "All";
  searchString: any;
  constructor() {
    this.categories = ["All", "Video", "Music", "Marketing", "Copywriting"];
  }
  /*this is from sharedBranch1*/
}
