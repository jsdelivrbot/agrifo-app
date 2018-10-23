import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {base_url} from '../../providers/config/config';
import { Http, Headers, RequestOptions  } from '@angular/http';
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
profile = { name: '', occupation: '', phone: '', address: '', user_id : 0};

  constructor(public navCtrl: NavController, private toastCtrl: ToastController,private storage: Storage, public loadingCtrl: LoadingController, public navParams: NavParams , public http: Http) {
		

  }


  ionViewWillEnter() {
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

  getProfile() {
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
  

  // update() {
  //   this.createLoader();
   
	 //  	this.http.get( base_url + 'api/update_profile?key=43730487024f808fcxxxc22424' + '&id=' +  this.ag_id  + '&name=' + this.profile.name  + '&phone=' + this.profile.phone  + '&occupation=' + this.profile.occupation + '&location=' + this.profile.address  )
	 //      .map(res => res.json())
	 //      .subscribe(data => {
	 //        console.log(data);

	 //  		if(data.status === "successful"){
		//         this.loading.dismiss();
	 //  			this.presentToast("Updated");
	 //  		}

	 //      },
  //       err => { 
	 //        this.loading.dismiss();
  //         this.presentToast("Could not connect, please check your connection");
  //       })
  // }
  

  update() {
      this.profile.user_id =  this.ag_id;
      this.showLoading('saving profile');

      var headers = new Headers();
      // headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      let options = new RequestOptions({headers: headers});

      this.http.post(base_url + 'api/update_profile?key=43730487024f808fcxxxc22424', this.profile, options)
          .map(res => res.json())
          .subscribe(data => {
              if (data.status === "successful") {
              this.loading.dismiss();
                  this.presentToast("Profile Saved");

                    this.getProfile();
              }
          },
          err => {
              this.loading.dismiss();
              this.presentToast("Could not connect, please check your connection");
          })
  }

  showLoading(str) { 
    // Optional Parameter
     this.loading = this.loadingCtrl.create({
         content: str,
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
