import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import {base_url} from '../../providers/config/config';
import { Http } from '@angular/http';
import { ToastController } from 'ionic-angular';

@IonicPage()

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  createSuccess = false;
  registerCredentials = { username: '', email: '', password : '',  phone : ''};


  constructor(public nav: NavController,private storage: Storage , private toastCtrl: ToastController, public navParams: NavParams, public http: Http, private auth: AuthServiceProvider, private alertCtrl: AlertController) {
  }

  public register(){

    this.http.get( base_url + 'api/register?key=43730487024f808fcxxxc22424' + '&username=' + this.registerCredentials.username+ '&email=' + this.registerCredentials.email + '&password=' + this.registerCredentials.password+ '&phone=' + this.registerCredentials.phone)
            .map(res => res.json())
            .subscribe(data => {
              console.log(data);
              // this.topics = data.topics;
              if(data.message == "successful"){
                this.storage.set('ag_id', data.id);
                this.storage.set('ag_username', this.registerCredentials.username);
                this.storage.set('ag_email', this.registerCredentials.email);
                this.presentToast("Account Created, thank you for joining Agrifo");

                this.nav.setRoot(HomePage);
              }

              if(data.message == "taken"){
               this.showPopup("Opps!", "Account already exists with that Email Address");
              }

    })

    // this.auth.register(this.registerCredentials).subscribe(success =>{
    //  if(success){
    //    this.createSuccess = true;
    //    this.showPopup("Success", 'Account Created');
    //  }else{
    //    this.showPopup("Error", "Problem creating account");
    //  }
    // }, error => {
    //  this.showPopup("Error", error);
    // });
  
  }


    presentToast(str) {
      let toast = this.toastCtrl.create({
        message: str,
        duration: 3000,
        position: 'bottom'
      });


      toast.present();
    }


  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.nav.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }

}
