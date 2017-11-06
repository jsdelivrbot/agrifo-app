import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';
import 'rxjs/add/operator/map';
import {base_url} from '../../providers/config/config';
import { CommunityPage } from '../community/community';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';

declare var cordova: any;


@Component({
  selector: 'page-create-topic',
  templateUrl: 'create-topic.html',
})
export class CreateTopicPage {
  data = { title: '', body: '', user_id : 0};
  lastImage: string = null;
  loading: Loading;
  ag_id : any;
  constructor(public navCtrl: NavController,  public navParams: NavParams, public http: Http, private camera: Camera, private transfer: Transfer, private storage: Storage, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController) { 
  }

  ionViewWillEnter() {
       this.storage.get('ag_id')
      .then((ag_id) => {
        if (ag_id) {
          this.ag_id = ag_id;
        }
      });
   }

  savePost(data) {
  if(this.lastImage){
        this.storage.get('ag_id').then(ag_id=>{

        // Destination URL
        var url = base_url + "api/create_topic?key=43730487024f808fcxxxc22424" +'&topic_by=' +  this.ag_id  + '&body=' + encodeURIComponent(data.body).replace(/%20/g,'+')  + '&title=' +  encodeURIComponent(data.title).replace(/%20/g,'+')    + '&by_username=' + 'kazim';
        
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
          this.presentToast('Topic Created.');
            this.navCtrl.setRoot(CommunityPage);
          // this.navCtrl.setRoot(MyshopPage);
        }, err => {
          console.log(err);
          this.loading.dismissAll()
          this.presentToast('Error while uploading photo.');
        });
      });

        }else{
      this.loading = this.loadingCtrl.create({
          content: 'Uploading...',
        });
        this.loading.present();
       
        data.topic_by = this.ag_id;

      this.http.get( base_url + 'api/create_topic?key=43730487024f808fcxxxc22424' + '&topic_by=' + this.ag_id  + '&body=' + data.body  + '&title=' + data.title   + '&by_username=' + 'kazim' )
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);

          if(data.message === "successful"){
            this.loading.dismissAll()

            this.presentToast("Posted");
            this.navCtrl.setRoot(CommunityPage);

          }
        },
        err => { 
              this.loading.dismiss();
              this.presentToast("Could not connect, please check your connection");
              // reject(err);
        })

      }

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
    position: 'bottom'
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



}
