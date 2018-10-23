import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import {base_url} from '../../providers/config/config';
import { Http, Headers, RequestOptions  } from '@angular/http';
import {ToastController, MenuController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {TabsPage} from '../tabs/tabs';

@IonicPage()

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  createSuccess = false;
  registerCredentials = { name: '', email: '', password : '',  phone : ''};
  loading: Loading;


  constructor(public nav: NavController,private storage: Storage , public menu: MenuController, private loadingCtrl: LoadingController, private toastCtrl: ToastController, public navParams: NavParams, public http: Http, private auth: AuthServiceProvider, private alertCtrl: AlertController) {
  }

  // public register(){

  //   this.http.get( base_url + 'api/register?key=43730487024f808fcxxxc22424' + '&username=' + this.registerCredentials.username+ '&email=' + this.registerCredentials.email + '&password=' + this.registerCredentials.password+ '&phone=' + this.registerCredentials.phone)
  //           .map(res => res.json())
  //           .subscribe(data => {
  //             console.log(data);
  //             // this.topics = data.topics;
  //             if(data.message == "successful"){
  //               this.storage.set('ag_id', data.id);
  //               this.storage.set('ag_username', this.registerCredentials.username);
  //               this.storage.set('ag_email', this.registerCredentials.email);
  //               this.presentToast("Account Created, thank you for joining Agrifo");

  //               this.nav.setRoot(HomePage);
  //             }

  //             if(data.message == "taken"){
  //              this.showPopup("Opps!", "Account already exists with that Email Address");
  //             }

  //   })

  //   // this.auth.register(this.registerCredentials).subscribe(success =>{
  //   //  if(success){
  //   //    this.createSuccess = true;
  //   //    this.showPopup("Success", 'Account Created');
  //   //  }else{
  //   //    this.showPopup("Error", "Problem creating account");
  //   //  }
  //   // }, error => {
  //   //  this.showPopup("Error", error);
  //   // });
  
  // }




  register() {

    this.showLoading();

    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    

    this.http.post( base_url + 'api/register?key=43730487024f808fcxxxc22424', this.registerCredentials, options)
      .map(res => res.json())
      .subscribe(data => {
        // this.resources = data.resources;
        console.log(data);

        if(data.message === "successful"){
            this.storage.set('ag_id', data.insert_id);
            this.storage.set('ag_name', this.registerCredentials.name);
            this.storage.set('ag_email', this.registerCredentials.email);
            this.loading.dismiss();
            this.presentToast("Account Created, thank you for joining Agrifo");
            this.nav.setRoot(TabsPage);

        }


        if(data.message == "taken"){
        this.loading.dismiss();

         this.showPopup("Opps!", "Account already exists with that Email Address. Please try another one");
        }
      },
        err => { 
          this.loading.dismiss();
          this.presentToast("Could not connect, please check your connection");
        })
  }



  validEmail() {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this.registerCredentials.email);
  }

    presentToast(str) {
      let toast = this.toastCtrl.create({
        message: str,
        duration: 3000,
        position: 'bottom'
      });


      toast.present();
    }

    ionViewDidLoad() {
        this.menu.swipeEnable(false);
    }
  showLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
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
