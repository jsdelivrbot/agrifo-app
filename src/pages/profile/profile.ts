import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {base_url} from '../../providers/config/config';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { Loading, LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  ag_id: any;
 loading: Loading;
profile = { name: '', occupation: '', phone: '', location: '', user_id : 0};

  constructor(public navCtrl: NavController, private toastCtrl: ToastController,private storage: Storage, public loadingCtrl: LoadingController, public navParams: NavParams , public http: Http) {
		

  }


  ionViewWillEnter() {
    // this.getOrders();
       this.storage.get('ag_id')
      .then((ag_id) => {
        if (ag_id) {
          this.ag_id = ag_id;
this.http.get( base_url + 'api/get_user_profile?key=43730487024f808fcxxxc22424' + '&id=' + ag_id)
          .map(res => res.json())
          .subscribe(data => {
            console.log(data);
            this.profile = data;

          })

        }
      });

      }
  

  update() {
    this.createLoader();
   
	  	this.http.get( base_url + 'api/update_profile?key=43730487024f808fcxxxc22424' + '&id=' +  4  + '&name=' + this.profile.name  + '&phone=' + this.profile.phone  + '&occupation=' + this.profile.occupation + '&location=' + this.profile.location  )
	      .map(res => res.json())
	      .subscribe(data => {
	        console.log(data);

	  		if(data.status === "successful"){
		        this.loading.dismiss();
	  			this.presentToast("Updated");
	  		}

	      },
        err => { 
	        this.loading.dismiss();
          this.presentToast("Could not connect, please check your connection");
        })
  }
  
  createLoader() { 
    // Optional Parameter
     this.loading = this.loadingCtrl.create({
         content: 'posting.',
       });
       this.loading.present();
     }

	  presentToast(str) {
		  let toast = this.toastCtrl.create({
		    message: str,
		    duration: 3000,
		    position: 'bottom'
		  });


		  toast.present();
		}

}
