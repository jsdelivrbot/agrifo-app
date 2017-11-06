import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {base_url} from '../../providers/config/config';
import { ReplyTopicPage } from '../reply-topic/reply-topic';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ToastController } from 'ionic-angular';
import { Loading, LoadingController } from 'ionic-angular';


@Component({
  selector: 'page-view-topic',
  templateUrl: 'view-topic.html',
})
export class ViewTopicPage {
  replies: any;
  topic: any;
  base_url: any;
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams , private toastCtrl: ToastController, public loadingCtrl: LoadingController,  public http: Http) {
     let id = navParams.get('id');
     this.base_url = base_url;
            this.createLoader();
     this.http.get( base_url + 'api/gettopic?key=43730487024f808fcxxxc22424' + '&id=' + id)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        this.loading.dismiss();

      data['answers'].forEach(function(entry) {
        let r = Math.floor(Math.random() * (6+1));
        entry.cl_no = r;
      });
      
        this.topic = data.topic['0'];
        this.replies = data.answers;

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

  reply() {
      this.navCtrl.push(ReplyTopicPage, {topic : this.topic});
  }


}
