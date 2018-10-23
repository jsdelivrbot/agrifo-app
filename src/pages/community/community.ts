import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CreateTopicPage } from '../create-topic/create-topic';
import { ViewTopicPage } from '../view-topic/view-topic';
import {base_url} from '../../providers/config/config';
import { ToastController } from 'ionic-angular';
import { Loading, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {  Slides } from 'ionic-angular';
import {Segment} from 'ionic-angular';
import { Scroll } from 'ionic-angular';
import { Events } from 'ionic-angular';



@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
})
export class CommunityPage {

  @ViewChild('mySlider') slider: Slides;
  selectedSegment = 0;
  slides: any;
  loading: Loading;
  base_url: any;
  c_pos = 0;
  loadingGtopics = true;
  topics: any;
  Gtopics: any;
  groups;
    @ViewChild(Segment)
    private segment: Segment;

  @ViewChild('scroll') scroll: any;

  constructor(public nav: NavController, public navParams: NavParams , private toastCtrl: ToastController, public loadingCtrl: LoadingController,  public http: Http ) {
    this.createLoader();
      // this.selectedSegment = 'first';
     this.base_url = base_url;

    this.http.get( base_url + 'api/topics?key=43730487024f808fcxxxc22424')
      .map(res => res.json())
      .subscribe(data => {


      data['topics'].forEach(function(entry) {
        let r = Math.floor(Math.random() * (6+1));
        entry.cl_no = r;
      });
        this.topics = data.topics;
        console.log(data);
        this.loading.dismiss();

      },
      err => { 
            this.loading.dismiss();
            this.presentToast("Could not connect, please check your connection");
            // reject(err);
      })
  }
  
    public backToStart(): void {
      this.scroll.scrollElement.scrollLeft = 0;
    }

    public scrollToLeft(): void {
      this.c_pos -= 500;
      // this.scroll._scrollContent.nativeElement.scrollTo({ right: 0, top: 0, behavior: 'smooth' });
      this.scroll._scrollContent.nativeElement.scrollLeft = this.c_pos;
    }

    public scrollToRight(): void {
        this.c_pos += 500;
      // this.scroll._scrollContent.nativeElement.scrollTo({ right: 0, top: 0, behavior: 'smooth' });
      this.scroll._scrollContent.nativeElement.scrollLeft = this.c_pos;
    }
public setOption(index, event) {
  // console.log(event);
    this.slider.slideTo(index);
    // this.loadTopicsByGroup(index);
    if (this.groups[index] != null) {
      this.selectedSegment = this.groups[index]; 

      //note you have to use "tap" or "click" - if you bind to "ionSelected" you don't get the "target" property
      let segments = event.target.parentNode.children;
      let len = segments.length;
      for (let i=0; i < len; i++) {
        segments[i].classList.remove('segment-activated');
      }
      event.target.classList.add('segment-activated');
  }
  }
  loadGroups(){
    
      this.loadingGtopics = true;
      this.http.get( base_url + 'api/get_all_groups?key=43730487024f808fcxxxc22424')
      .map(res => res.json())
      .subscribe(data => {
        data.unshift({id:99999999, name: 'Home'});
        this.selectedSegment = 0;
        this.groups = data;
        this.loadingGtopics = false;
        setTimeout(function () {
          document.getElementById('bt0').click();
        }, 1000);
      },
        err => { 
            this.loadingGtopics = false;
            // Hotfix for dynamic ion-segment-buttons issue
            setTimeout(() => {
                if (this.segment) {
                    this.segment.ngAfterContentInit();
                }
            });
        })
    
  } 




  onSegmentChanged(segmentButton) {
    // console.log(111);
    // const selectedIndex = this.groups.findIndex((slide) => {
    //   return slide.id === segmentButton.value;
    // });
    // this.slider.slideTo(selectedIndex);
  }
  
  onSlideChanged(slider) {
    // console.log(slider);
  const currentSlide = this.groups[slider.getActiveIndex()];
        let r = 'bt' + slider.getActiveIndex(); 
          document.getElementById(r).click();

          if(slider.getActiveIndex() !== 0){
            this.loadTopicsByGroup(slider.getActiveIndex());
          }else{
            this.loadTopics();
          }
        // console.log(slider.getActiveIndex());
      // this.selectedSegment = currentSlide.id;
  }
loadTopicsByGroup(id){
  this.Gtopics = undefined;
  if(id !== 0){
    this.http.get( base_url + 'api/grouptopics?key=43730487024f808fcxxxc22424&g_id=' + id)
      .map(res => res.json())
      .subscribe(data => {

      data['topics'].forEach(function(entry) {
        let r = Math.floor(Math.random() * (6+1));
        entry.cl_no = r;
      });
        this.Gtopics = data.topics;
      },
      err => { 
        this.presentToast("Could not connect, please check your connection");
            // reject(err);
      })
  }
}
ionViewWillEnter(){
    this.loadGroups();
    this.http.get( base_url + 'api/topics?key=43730487024f808fcxxxc22424')
      .map(res => res.json())
      .subscribe(data => {

      data['topics'].forEach(function(entry) {
        let r = Math.floor(Math.random() * (6+1));
        entry.cl_no = r;
      });
        this.topics = data.topics;
      },
      err => { 
        this.presentToast("Could not connect, please check your connection");
            // reject(err);
      })
}
loadTopics(){
    this.http.get( base_url + 'api/topics?key=43730487024f808fcxxxc22424')
      .map(res => res.json())
      .subscribe(data => {

      data['topics'].forEach(function(entry) {
        let r = Math.floor(Math.random() * (6+1));
        entry.cl_no = r;
      });
        this.topics = data.topics;
      },
      err => { 
        this.presentToast("Could not connect, please check your connection");
            // reject(err);
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

  viewTopic(id) {
    console.log(id);

    this.nav.push(ViewTopicPage, {id : id});

  }
  createTopic(page) {
    this.nav.push(CreateTopicPage);

  }

}
