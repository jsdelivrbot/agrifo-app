import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { CommunityPage } from '../community/community';
import { SearchPage } from '../search/search';
import { ProfilePage } from '../profile/profile';
import { MessagesPage } from '../messages/messages';
import { AddproductPage } from '../addproduct/addproduct';
import { MarketPage } from '../market/market';
import { MyshopPage } from '../myshop/myshop';


@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = CommunityPage;
  tab3Root = AddproductPage;
  tab4Root = MyshopPage;
  tab5Root = ProfilePage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }


}
