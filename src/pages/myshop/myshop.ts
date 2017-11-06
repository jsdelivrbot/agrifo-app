import { Component } from '@angular/core';
import { AddproductPage } from '../addproduct/addproduct';
import {base_url} from '../../providers/config/config';
import { NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/map';


@Component({
  selector: 'page-myshop',
  templateUrl: 'myshop.html',
})
export class MyshopPage {
  id : any;
  base_url : any;
  products : any;
  loading: Loading;

  constructor(public navCtrl: NavController,  public navParams: NavParams, public http: Http,  private storage: Storage,  public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController) { 
      this.base_url = base_url;

  }
  

  addProduct(page) {
    this.navCtrl.push(AddproductPage);

  }

  hideProduct(id, index) {

    this.http.get( base_url + 'api/hide_product?key=43730487024f808fcxxxc22424'+ "&id=" + id)
        .subscribe(data => {
          this.products[index].hide = 1;
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


  ionViewDidLoad() {
    this.createLoader();

      this.storage.get('ag_id').then(ag_id=>{
          this.id = ag_id;

    this.http.get( base_url + 'api/get_user_products?key=43730487024f808fcxxxc22424'+ "&user_id=" + this.id)
        .map(res => res.json())
        .subscribe(data => {
          this.products = data;
        let products = data;
          this.products = Object.keys( products ).map( p => Object.assign( products[p], {products:p} ) );
          console.log(this.products);
        this.loading.dismiss();

        },
        err => { 
              this.loading.dismiss();
              this.presentToast("Could not connect, please check your connection");
              // reject(err);
        })  
      });

      }
}
