import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import {base_url} from '../../providers/config/config';
import { Http } from '@angular/http';

@IonicPage()

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
	loading: Loading;
  registerCredentials = { email: '', password: ''};
  userDetails = { username: '', password: ''};


  constructor(public nav: NavController,private storage: Storage , public navParams: NavParams, private auth: AuthServiceProvider, private alertCtrl : AlertController, private loadingCtrl: LoadingController, public http: Http) {
  }

  public createAccount(){
  	this.nav.push('RegisterPage');
  }

  public login(){
  	// this.showLoading()
    console.log(this.userDetails);

    this.http.get( base_url + 'api/login?key=43730487024f808fcxxxc22424' + '&username=' + this.userDetails.username + '&password=' + this.userDetails.password)
            .map(res => res.json())
            .subscribe(data => {
              // this.topics = data.topics;
              if(data.status == "successful"){
                this.storage.set('ag_id', data['0'].id);
                this.storage.set('ag_username', data['0'].username);
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
  	alert.present(prompt);
  }
  ionViewDidLoad() {	
    console.log('ionViewDidLoad LoginPage');
  }

}
