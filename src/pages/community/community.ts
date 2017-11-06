import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CreateTopicPage } from '../create-topic/create-topic';
import { ViewTopicPage } from '../view-topic/view-topic';
import {base_url} from '../../providers/config/config';
import { ToastController } from 'ionic-angular';
import { Loading, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';



@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
})
export class CommunityPage {
  loading: Loading;

  topics: any;

  constructor(public nav: NavController, public navParams: NavParams , private toastCtrl: ToastController, public loadingCtrl: LoadingController,  public http: Http ) {
    this.createLoader();

    this.http.get( base_url + 'api/topics?key=43730487024f808fcxxxc22424')
      .map(res => res.json())
      .subscribe(data => {


      data['topics'].forEach(function(entry) {
        let r = Math.floor(Math.random() * (6+1));
        entry.cl_no = r;
      });
        this.topics = data.topics;
        console.log(data);
        this.loading.dismiss();

      },
        err => { 
              this.loading.dismiss();
              this.presentToast("Could not connect, please check your connection");
              // reject(err);
        })
  }


createLoader() { 
   this.loading = this.loadingCtrl.create({
       content: 'loading.',
     });
       this.loading.present();
}

  
  presentToast(str) {
    let toast = this.toastCtrl.create({
      message: str,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }

  viewTopic(id) {
    console.log(id);

    this.nav.push(ViewTopicPage, {id : id});

  }
  createTopic(page) {
    this.nav.push(CreateTopicPage);

  }

}
