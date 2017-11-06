import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { ViewproductPage } from '../viewproduct/viewproduct';
import {base_url} from '../../providers/config/config';
import { NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Select } from 'ionic-angular';

import 'rxjs/add/operator/map';


@Component({
  selector: 'page-market',
  templateUrl: 'market.html',
})
export class MarketPage {
  @ViewChild(Select) select: Select;


  id : any;
  base_url : any;
  products : any;
  category : any;
  cats = [];
  categories = [];
  loading: Loading;
  results : any;
  searching = false;

  constructor(public navCtrl: NavController,  public navParams: NavParams, public http: Http,  private storage: Storage,  public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController) { 
      this.base_url = base_url;
  }
 numberToEnglish( n ) {

    var string = n.toString(), units, tens, scales, start, end, chunks, chunksLen, chunk, ints, i, word, words;

    /* Is number zero? */
    if( parseInt( string ) === 0 ) {
        return 'zero';
    }

    /* Array of units as words */
    units = [ '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen' ];

    /* Array of tens as words */
    tens = [ '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety' ];

    /* Array of scales as words */
    scales = [ '', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion' ];

    /* Split user arguemnt into 3 digit chunks from right to left */
    start = string.length;
    chunks = [];
    while( start > 0 ) {
        end = start;
        chunks.push( string.slice( ( start = Math.max( 0, start - 3 ) ), end ) );
    }

    /* Check if function has enough scale words to be able to stringify the user argument */
    chunksLen = chunks.length;
    if( chunksLen > scales.length ) {
        return '';
    }

    /* Stringify each integer in each chunk */
    words = [];
    for( i = 0; i < chunksLen; i++ ) {

        chunk = parseInt( chunks[i] );

        if( chunk ) {

            /* Split chunk into array of individual integers */
            ints = chunks[i].split( '' ).reverse().map( parseFloat );

            /* If tens integer is 1, i.e. 10, then add 10 to units integer */
            if( ints[1] === 1 ) {
                ints[0] += 10;
            }

            /* Add scale word if chunk is not zero and array item exists */
            if( ( word = scales[i] ) ) {
                words.push( word );
            }

            /* Add unit word if array item exists */
            if( ( word = units[ ints[0] ] ) ) {
                words.push( word );
            }

            /* Add tens word if array item exists */
            if( ( word = tens[ ints[1] ] ) ) {
                words.push( word );
            }

            /* Add 'and' string after units or tens integer if: */
            if( ints[0] || ints[1] ) {

                /* Chunk has a hundreds integer or chunk is the first of multiple chunks */
                if( ints[2] || ! i && chunksLen ) {
                    // words.push( and );
                }

            }

            /* Add hundreds word if array item exists */
            if( ( word = units[ ints[2] ] ) ) {
                words.push( word + ' hundred' );
            }

        }

    }

    return words.reverse().join( ' ' );

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


  onCancel() {
    this.searching = false;
    // this.results = [];
    // this.getProducts();
  }

  searchItems(ev: any) {
    // this.getItems();
    this.searching = true;
    // set val to the value of the searchbar
    let val = ev.target.value;
    // console.log(this.items);
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
    this.http.get( base_url + 'api/search_item?key=43730487024f808fcxxxc22424' + '&term=' + val )
        .map(res => res.json())
        .subscribe(data => {
            // this.items = data;
      // console.log(this.items);
             // this.i = this.items;
              // this.items = Object.keys( this.i ).map( p => Object.assign( this.i[p], {i:p} ) );
            // this.loading.dismiss();
            // this.businesses = this.columns;
        })
      // this.results = this.items.filter((item) => {
      //   return (item.item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      // })
    }
  }

  ionViewDidLoad() {
    this.createLoader();

      this.storage.get('ag_id').then(ag_id=>{
          this.id = ag_id;

    this.http.get( base_url + 'api/get_all_products?key=43730487024f808fcxxxc22424'+ "&user_id=" + this.id)
        .map(res => res.json())
        .subscribe(data => {
          this.products = data;
          let products = data;
          this.products = Object.keys( products ).map( p => Object.assign( products[p], {products:p} ) );
          console.log(this.products);
        this.loading.dismiss();

          this.products.forEach((item, index) => {
            let indexOfItem = this.cats.findIndex(i => i.id === item.category);
          if(indexOfItem > -1){

              }else{
                this.cats.push({id: item.category, name: item.category_name})
              }
            });

        },
        err => { 
              this.loading.dismiss();
              this.presentToast("Could not connect, please check your connection");
              // reject(err);
        })  

    this.http.get( base_url + 'api/get_categories?key=43730487024f808fcxxxc22424')
        .map(res => res.json())
        .subscribe(data => {
          this.categories = data.categories;
          // let products = data;
          // this.products = Object.keys( products ).map( p => Object.assign( products[p], {products:p} ) );
          console.log(this.categories);
        })  
      });

      }

openFilter(){
  this.select.open()
}

empty = false;

filter(cat){
      this.createLoader();

    this.http.get( base_url + 'api/get_category_products?key=43730487024f808fcxxxc22424'+ "&category=" + cat)
        .map(res => res.json())
        .subscribe(data => {
          this.products = data;
          let products = data;
          this.products = Object.keys( products ).map( p => Object.assign( products[p], {products:p} ) );
          console.log(this.products);
          if(data.length < 1){
            this.empty = true;
          console.log(data.length);
          }else{
            this.empty = false;
          }
              this.loading.dismiss();
          // this.products = Object.keys( products ).map( p => Object.assign( products[p], {products:p} ) );
        },
        err => { 
              this.loading.dismiss();
              this.presentToast("Could not connect, please check your connection");
              // reject(err);
        })  
}


  viewProduct(id) {
    console.log(id);

    this.navCtrl.push(ViewproductPage, {id : id});

  }
}
