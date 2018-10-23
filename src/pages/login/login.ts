import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import {base_url} from '../../providers/config/config';
import { Http } from '@angular/http';
import {Events, TextInput, Modal, ModalController, ModalOptions} from 'ionic-angular';
import {ToastController, MenuController} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';

@IonicPage()

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
	loading: Loading;
  registerCredentials = { email: '', password: ''};
  userDetails = { email: '', password: ''};


  constructor(public nav: NavController,private storage: Storage ,  public menu: MenuController, private events: Events, public navParams: NavParams, private auth: AuthServiceProvider, private alertCtrl : AlertController,  private toastCtrl: ToastController, private loadingCtrl: LoadingController, public http: Http) {
  }

  public createAccount(){
  	this.nav.push('RegisterPage');
  }

  public logdin(){
  	// this.showLoading()
    console.log(this.userDetails);

    this.http.get( base_url + 'api/login?key=43730487024f808fcxxxc22424' + '&email=' + this.userDetails.email + '&password=' + this.userDetails.password)
            .map(res => res.json())
            .subscribe(data => {
              // this.topics = data.topics;
              if(data.status == "successful"){
                this.storage.set('ag_id', data['0'].id);
                this.storage.set('ag_name', data['0'].name);
                this.nav.setRoot('HomePage');
              }
    })
  	// this.auth.login(this.registerCredentials).subscribe(allowed=>{

  	// 	// if(allowed){
  	// 	// 	this.nav.setRoot('HomePage');
  	// 	// }else{
  	// 	// 	this.showError("Access Denied");
  	// 	// }
  	// }, error => { this.showError(error)
  	// });
  }


    public login() {
        this.showLoading()

        this.http.get(base_url + 'api/login?key=43730487024f808fcxxxc22424' + '&email=' + encodeURIComponent(this.userDetails.email).replace(/%20/g, '+') + '&password=' + encodeURIComponent(this.userDetails.password).replace(/%20/g, '+'))
            .map(res => res.json())
            .subscribe(data => {
                if (data.message == "successful") {
                    this.storage.set('ag_id', data.id);
                    this.storage.set('ag_name', data.email);
                    if (data.id) {
                        // this.events.publish('profile:profileupdated', data, Date.now())
                        this.loading.dismiss();
                        this.nav.setRoot(TabsPage);
                    }
                } else {
                    this.loading.dismiss();
                    this.presentToast('Login failed, please check your credentials');
                }
            },
            err => {
                this.presentToast("Could not connect, please check your connection");
                this.loading.dismiss();
            })
    }



    presentToast(str) {
        let toast = this.toastCtrl.create({
            message: str,
            duration: 3000,
            position: 'bottom'
        });


        toast.present();
    }

  showLoading(){
  	this.loading = this.loadingCtrl.create({
  		content: 'Please wait...',
  		dismissOnPageChange: true
  	});
  	this.loading.present();
  }

  showError(text){
  	this.loading.dismiss();

  	let alert = this.alertCtrl.create({
  		title: 'Fail',
  		subTitle: text,
  		buttons: ['OK']
  	});
  	alert.present();
  }
  ionViewDidLoad() {	
    console.log('ionViewDidLoad LoginPage');
  }

}
