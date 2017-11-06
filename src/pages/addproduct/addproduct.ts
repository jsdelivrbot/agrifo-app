import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';

import { Http, Headers, RequestOptions  } from '@angular/http';
import 'rxjs/add/operator/map';
import {base_url} from '../../providers/config/config';
import { Storage } from '@ionic/storage';
import { MyshopPage } from '../myshop/myshop';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
 
declare var cordova: any;


@Component({
  selector: 'page-addproduct',
  templateUrl: 'addproduct.html',
})
export class AddproductPage {
	data = { name: '', description: '', category: '', price: '', phone: '', image: '', user_id: ''};
	id : any;
	categories : any;
  base_url : any;
  lastImage: string = null;
  loading: Loading;
  // constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private toastCtrl: ToastController, private storage: Storage) {
  // }
  constructor(public navCtrl: NavController,  public navParams: NavParams, public http: Http, private camera: Camera, private transfer: Transfer, private storage: Storage, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController) { 
    this.base_url = base_url;
  }

  addProduct(){
  	// this.storage.get('ag_id')
  	// 	.then((ag_id) => {
   //    });



      this.storage.get('ag_id').then(ag_id=>{
        	this.id = ag_id;
      });


  	this.data.user_id = this.id;
  	console.log(this.data);

    // var headers = new Headers();
    // headers.append('Content-Type' , 'application/x-www-form-urlencoded; charset=UTF-8');
    // let options = new RequestOptions({ headers: headers });
  	
    this.uploadImage();
  	// this.http.post( base_url + 'api/add_product?key=43730487024f808fcxxxc22424', this.data, options)
	  // 	.map(res => res.json())
	  // 	.subscribe(data => {

	  // 		// if(data.status === "successful"){
	  // 		// 	this.presentToast();
			//   //   // this.navCtrl.setRoot(CommunityPage);

	  // 		// }
	  // 	})
  }

   presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  return newFileName;
}
 
// Copy the image to a local folder
private copyFileToLocalDir(namePath, currentName, newFileName) {
  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
    this.lastImage = newFileName;
  }, error => {
    this.presentToast('Error while storing file.');
  });
}
 
presentToast(text) {
  let toast = this.toastCtrl.create({
    message: text,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}
 
// Always get the accurate path to your apps folder
pathForImage(img) {
  if (img === null) {
    return '';
  } else {
    return cordova.file.dataDirectory + img;
  }
}

takePicture(sourceType) {
  // Create options for the Camera Dialog
  var options = {
    quality: 100,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true
  };
 
  // Get the data of an image
  this.camera.getPicture(options).then((imagePath) => {
    // Special handling for Android library
    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
    } else {
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }
  }, (err) => {
    this.presentToast('Error while selecting image.');
  });
}

public uploadImage() {

  this.storage.get('ag_id').then(ag_id=>{
      this.id = ag_id;


    this.data.user_id = this.id;
  // Destination URL
  var url = this.base_url + "api/add_product?key=43730487024f808fcxxxc22424" + "&name=" + encodeURIComponent(this.data.name ).replace(/%20/g,'+') + "&description=" + encodeURIComponent(this.data.description ).replace(/%20/g,'+')  + "&category=" + this.data.category + "&price=" + this.data.price + "&phone=" + this.data.phone + "&user_id=" + ag_id;
  
  // data = { name: '', description: '', category: '', price: '', phone: '', image: '', user_id: ''};

  // File for Upload
  var targetPath = this.pathForImage(this.lastImage);
 
  // File name only
  var filename = this.lastImage;
 
  var options = {
    fileKey: "file",
    fileName: filename,
    chunkedMode: false,
    mimeType: "multipart/form-data",
    params : {'fileName': filename}
  };
 
  const fileTransfer: TransferObject = this.transfer.create();
 
  this.loading = this.loadingCtrl.create({
    content: 'Uploading...',
  });
  this.loading.present();
 
  // Use the FileTransfer to upload the image
  fileTransfer.upload(targetPath, url, options).then(data => {
    this.loading.dismissAll()
    this.presentToast('Product succesful uploaded.');
    this.navCtrl.setRoot(MyshopPage);
  }, err => {
    console.log(err);
    this.loading.dismissAll()
    this.presentToast('Error while uploading product.');
  });
    });

}


  ionViewDidLoad() {
		this.http.get( base_url + 'api/get_categories?key=43730487024f808fcxxxc22424')
	      .map(res => res.json())
	      .subscribe(data => {
	        this.categories = data;
        let categories = data;
          this.categories = Object.keys( categories ).map( p => Object.assign( categories[p], {categories:p} ) );
	        console.log(this.categories);

	      })  
      }

}
