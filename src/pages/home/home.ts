import { Component, ViewChild } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController , ModalController, ViewController,Content} from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import {base_url} from '../../providers/config/config';
import { ViewTopicPage } from '../view-topic/view-topic';
import { CommunityPage } from '../community/community';
import { ProfilePage } from '../profile/profile';
import { MarketPage } from '../market/market';
import { MyshopPage } from '../myshop/myshop';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';
import 'rxjs/add/operator/map';
import { Select } from 'ionic-angular';
import { ViewproductPage } from '../viewproduct/viewproduct';
import { AlertController } from 'ionic-angular';

@IonicPage()

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
	username = '';
	email = '';
  topics: any;
  @ViewChild(Select) select: Select;
  searchPrefs = { state: '', lga: '', category: '', user_id: ''};
  id : any;
  base_url : any;
  ads : any;
  category : any;
  cats = [];
  categories = [];
  loading: Loading;
  results : any;
  searching = false;
  empty_result = false;
  loading2 = true;
  noConnection = false;


  constructor(public nav: NavController,  public modalCtrl: ModalController, private auth: AuthServiceProvider,public toastCtrl: ToastController, public loadingCtrl: LoadingController, private storage: Storage, public http: Http) {
  	  // this.openFilterModal();
      this.base_url = base_url;

      this.http.get( base_url + 'api/topics?key=43730487024f808fcxxxc22424' + '&user_id=' + 4)
        .map(res => res.json())
        .subscribe(data => {
          this.topics = data.topics.slice(0,5);
        })

  }

  viewTopic(id) {
    this.nav.push(ViewTopicPage, {id : id});
  }

  searchAds(ev: any) {
    // this.getItems();
    this.searching = true;
    // set val to the value of the searchbar
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
    this.http.get( base_url + 'api/search_ads?key=43730487024f808fcxxxc22424' + '&q=' + val  )
        .map(res => res.json())
        .subscribe(data => {
          this.ads = data;
        })
    }
  }
  onCancel() {
    this.searching = false;
    this.loadAds();
  }
  refreshPage(ev) {

      this.storage.get('ag_id').then(ag_id=>{
          this.id = ag_id;
          this.http.get( base_url + 'api/load_ads?key=43730487024f808fcxxxc22424'+ "&user_id=" + this.id)
              .map(res => res.json())
              .subscribe(data => {
                this.ads = data;
                let products = data;
                this.ads = Object.keys( products ).map( p => Object.assign( products[p], {products:p} ) );
                console.log(this.ads);

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
            });

      }
  loadAds() {
      this.loading2 = true;
      let url = base_url + 'api/load_ads?key=43730487024f808fcxxxc22424'+ "&user_id=" + this.id + "&c=" + this.searchPrefs.category + "&state=" + this.searchPrefs.state  + "&lga=" + this.searchPrefs.lga;
      this.storage.get('ag_id').then(ag_id=>{
          this.id = ag_id;
          this.http.get(url)
              .map(res => res.json())
              .subscribe(data => {
                this.ads = data;
                this.loading2 = false;
                this.noConnection = false;
                let products = data;
                this.ads = Object.keys( products ).map( p => Object.assign( products[p], {products:p} ) );
                // console.log(this.ads);
              },
              err => { 
                this.loading2 = false;
                this.noConnection = true;
              })  
            });

      }




  ionViewWillEnter() {
    this.LoadFilters();
  }


  LoadFilters(){
    let env = this;
   this.storage.get('agfilter')
   .then((cart) => {
      let c = JSON.parse(cart);
      if(c  && c !== null){
        this.searchPrefs = c;
      }
      if (!this.searchPrefs) {
        this.searchPrefs = { state: '', lga: '', category: '', user_id: ''};
       }

       this.loadAds();

      });
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

  openMarketPage() {
    this.nav.push(MarketPage);
  }

  openMyshopPage() {
    this.nav.push(MyshopPage);
  }

  openProfilePage() {
    this.nav.push(ProfilePage);
  }

  openForum() {
    this.nav.push(CommunityPage);
  }




  openFilterModal() {

    let modal = this.modalCtrl.create(FilterModal);
   modal.onDidDismiss(data => {
     this.LoadFilters();
   });
   modal.present();

  }



  viewProduct(ad) {
    // console.log(ad);
    this.nav.push(ViewproductPage, {ad : ad});
  }
  public logout(){
    
      this.storage.remove('ag_id').then(()=>{
          console.log('ag_id is removed');
        });
      this.storage.remove('ag_name').then(()=>{
          this.nav.setRoot(LoginPage)
        });
  }

}




@Component({
  template: `
       <ion-header>

  <ion-navbar color="white">
    <ion-title> Filter Ads</ion-title>
    <ion-buttons end>
    <button ion-button clear large (click)="dismiss()">
      <ion-icon name="md-close"></ion-icon>
    </button>

    </ion-buttons>
  </ion-navbar>

</ion-header>


<ion-content >

  <ion-list>
  
    <ion-item *ngIf="categories">
      <ion-label style="color: #212121">Category</ion-label>
      <ion-select [(ngModel)]="data.category" interface="popover">
        <ion-option  value="">All</ion-option>
        <ion-option  value="{{category.id}}"  *ngFor="let category of categories['0']">{{ category.name }}</ion-option>
      </ion-select>
    </ion-item>
    <ion-item *ngIf="states">
    <ion-label color="dark">State</ion-label>
    <ion-select name="state" [(ngModel)]="data.state" required  (ngModelChange)="filterLga(data.state)">
      <ion-option  value="">Any</ion-option>
      <ion-option *ngFor="let state of states"  value="{{state.id}}">{{ state.name }}</ion-option>
    </ion-select>
  </ion-item>
    <ion-item *ngIf="states">
    <ion-label color="dark">Local Govt. Area</ion-label>
    <ion-select [disabled]="!data.state" name="lga" [(ngModel)]="data.lga" required>
      <ion-option  value="">Any</ion-option>
      <ion-option  *ngFor="let lga of filtered_lga"  value="{{lga.id}}">{{ lga.name }}</ion-option>
    </ion-select>
  </ion-item> 


  </ion-list>

  <ion-item>
    <button ion-button color="light_green" (click)="save()" full >Apply</button>
  </ion-item>

</ion-content>
<style>

</style>
  `
})


export class FilterModal {

  ut_id: any;
  loading: Loading;
  base_url : any;
  str = "";
  adding_drugs = false;
  searching;
  empty_result;
  results;
  states: any;
  lga: any;
  filtered_lga;
  data = { state: '', lga: '', category: '', user_id: ''};
  categories : any;

  constructor(
    public platform: Platform,public params: NavParams,public viewCtrl: ViewController,public nav: NavController,private loadingCtrl: LoadingController, private toastCtrl: ToastController, public navParams: NavParams, public http: Http, private alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController, private storage: Storage) {
      this.base_url = base_url;
    }



  ionViewWillEnter() {
    // this.getCart();
  }



  ionViewDidEnter() {
       this.storage.get('ut_id')
      .then((ut_id) => {
        if (!ut_id) {

          // this.rootPage = LoginPage;
        }else{
        console.log(ut_id);
          this.ut_id = ut_id;

        }

      });
      }


  filterLga(s_id){ 
    if(this.filtered_lga){
      this.data.lga = '';  
    } 
    this.filtered_lga = this.lga.filter((lga) => {
           return (lga.state_id == s_id);;
      })
  }



  save(){
      if(this.data){
        this.str = JSON.stringify(this.data);
        this.storage.set('agfilter', this.str);
        this.presentToast("Saved");
      }
  } 



  LoadFilters(){
    let env = this;
   this.storage.get('agfilter')
   .then((cart) => {
      let c = JSON.parse(cart);
      if(c  && c !== null){
        this.data = c;
      }

      if(this.data.state){
        env.filterLga(env.data.state);
      }

        if (!this.data) {
          this.data = { state: '', lga: '', category: '', user_id: ''};

        }
      });
  }
  ionViewDidLoad() {
    this.http.get( base_url + 'api/get_categories?key=43730487024f808fcxxxc22424')
        .map(res => res.json())
        .subscribe(data => {
          this.categories = data;
        let categories = data;
          this.categories = Object.keys( categories ).map( p => Object.assign( categories[p], {categories:p} ) );

        })  
      }

  loadStates(){
      this.http.get( base_url + 'api/get_all_states?key=43730487024f808fcxxxc22424')
      .map(res => res.json())
      .subscribe(data => {
        this.states = data;
        // console.log(data);
      },
        err => { 

        setTimeout(() => {
              this.presentToast("Could not connect, please check your connection");
          }, 3000);
        })
    
  } 

  

  ngAfterViewInit() {
      this.loadStates();
      this.loadLga();
    }


  loadLga(){
      this.showLoading();
      this.http.get( base_url + 'api/get_all_lga?key=43730487024f808fcxxxc22424')
      .map(res => res.json())
      .subscribe(data => {
        this.loading.dismiss();
        this.lga = data;
        this.LoadFilters();
      },
        err => { 
        this.loading.dismiss();
        setTimeout(() => {
              this.presentToast("Could not connect, please check your connection");
          }, 3000);
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

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            
          }
        }
      ]
    });
    alert.present();
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }
}
