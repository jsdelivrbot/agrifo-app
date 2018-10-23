import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {base_url} from '../../providers/config/config';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ToastController } from 'ionic-angular';
import { Loading, LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-viewproduct',
  templateUrl: 'viewproduct.html',
})
export class ViewproductPage {
  loading: Loading;

	replies: any;
  ad: any;
  id: any;
	base_url: any;
  showNumber = false;
  constructor(public navCtrl: NavController, public navParams: NavParams ,  private toastCtrl: ToastController, public loadingCtrl: LoadingController, public http: Http) {
  	     let ad = navParams.get('ad');
        let r = Math.floor(Math.random() * (6+1));
        ad.poster.cl_no = r;
         this.ad = ad;
      this.base_url = base_url;
    this.createLoader();

     this.http.get( base_url + 'api/getad?key=43730487024f808fcxxxc22424' + '&id=' + ad.id)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        // this.ad = data['0'];
        this.loading.dismiss();
      },
        err => { 
              this.loading.dismiss();
              this.presentToast("Could not connect, please check your connection");
              // reject(err);
        })

  }

showPhone(){
  this.showNumber = true;
}

refresh(ev){
     this.http.get( base_url + 'api/getad?key=43730487024f808fcxxxc22424' + '&id=' + this.id)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        this.ad = data['0'];

        setTimeout(() => {
            ev.complete();
          }, 2000);
      },
        err => { 

        setTimeout(() => {
            ev.complete();
          }, 2000);
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


}
