import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import {base_url} from '../../providers/config/config';
import { ViewTopicPage } from '../view-topic/view-topic';
import { CommunityPage } from '../community/community';
import { ProfilePage } from '../profile/profile';
import { MarketPage } from '../market/market';
import { MyshopPage } from '../myshop/myshop';
import { Storage } from '@ionic/storage';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
@IonicPage()

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
	username = '';
	email = '';
  topics: any;

  constructor(public nav: NavController, private auth: AuthServiceProvider, private storage: Storage, public http: Http) {
  	let info = this.auth.getUserInfo();
  	this.username = info['name'];
  	this.email = info['email'];

    this.http.get( base_url + 'api/topics?key=43730487024f808fcxxxc22424' + '&user_id=' + 4)
      .map(res => res.json())
      .subscribe(data => {
        this.topics = data.topics.slice(0,5);
        console.log(data);

      })

  }

  viewTopic(id) {
    this.nav.push(ViewTopicPage, {id : id});
  }



  openMarketPage() {
    this.nav.push(MarketPage);
  }

  openMyshopPage() {
    this.nav.push(MyshopPage);
  }

  openProfilePage() {
    this.nav.push(ProfilePage);
  }

  openForum() {
    this.nav.push(CommunityPage);
  }

  public logout(){
    
      this.storage.remove('ag_id').then(()=>{
          console.log('ag_id is removed');
        });
      this.storage.remove('ag_username').then(()=>{
          this.nav.setRoot('LoginPage')
        });
  }

}
