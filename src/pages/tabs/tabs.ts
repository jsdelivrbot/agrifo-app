import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { CommunityPage } from '../community/community';
import { SearchPage } from '../search/search';
import { ProfilePage } from '../profile/profile';
import { MessagesPage } from '../messages/messages';


@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root = HomePage;
  tab3Root = CommunityPage;;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }


}
