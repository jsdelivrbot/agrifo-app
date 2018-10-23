import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { CommunityPage } from '../pages/community/community';
import { MarketPage } from '../pages/market/market';
import { MyshopPage } from '../pages/myshop/myshop';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../pages/tabs/tabs';



@Component({
  templateUrl: 'app.html'
})


export class MyApp {
  username = '';
  rootPage = HomePage;
  pages: Array<{title: string, component: any, icon: any}>;

  @ViewChild(Nav) nav: Nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private auth: AuthServiceProvider,private storage: Storage) {
    platform.ready().then(() => {

       this.pages = [
        { title: 'Menu', component: HomePage , icon: 'md-apps'},
        { title: 'Forum', component: CommunityPage , icon: 'ios-people'},
        { title: 'Market', component: MarketPage , icon: 'md-cash'},
        { title: 'My Shop', component: MyshopPage , icon: 'md-briefcase'},
        { title: 'You', component: ProfilePage , icon: 'md-contact'}
      ];  

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.backgroundColorByHexString('#ccc');
      splashScreen.hide();

    });
  }

   ngAfterViewInit() {
        
       this.storage.get('ag_id')
      .then((ag_id) => {
        if (ag_id) {
              this.nav.setRoot(TabsPage);

          // this.rootPage = ResourcesPage;
        } else {
              this.nav.setRoot(LoginPage);
        }
      });
    }



  openPage(page) {
    // console.log(page);
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  // this.nav.push(page.component.name);

  }
}

