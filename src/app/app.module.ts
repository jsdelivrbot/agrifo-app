import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { LoginPage } from '../pages/login/login';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AddproductPage } from '../pages/addproduct/addproduct';

import { MarketPage } from '../pages/market/market';
import { MyshopPage } from '../pages/myshop/myshop';
import { ViewproductPage } from '../pages/viewproduct/viewproduct';
import { ReplyTopicPage } from '../pages/reply-topic/reply-topic';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RegisterPage } from '../pages/register/register';
import { SearchPage } from '../pages/search/search';
import { ProfilePage } from '../pages/profile/profile';
import { MessagesPage } from '../pages/messages/messages';
import { TabsPage } from '../pages/tabs/tabs';
import { CommunityPage } from '../pages/community/community';
import { CreateTopicPage } from '../pages/create-topic/create-topic';
import { ViewTopicPage } from '../pages/view-topic/view-topic';

import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

import { RegisterPageModule } from '../pages/register/register.module';
import { HomePageModule } from '../pages/home/home.module';
import { LoginPageModule } from '../pages/login/login.module';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';

@NgModule({
  declarations: [
    MyApp,   
    CommunityPage,
    CreateTopicPage,
    ViewTopicPage,
    ViewproductPage,
    ProfilePage, 
    ReplyTopicPage,
    MyshopPage,
    AddproductPage,
    MarketPage,
    SearchPage, 
    MessagesPage, 
    TabsPage  
  ],
  imports: [
    BrowserModule,
    HttpModule, 
    RegisterPageModule,
    HomePageModule,
    LoginPageModule,
    IonicModule.forRoot(MyApp,{tabsPlacement: 'bottom'}),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage, 
    CreateTopicPage,
    ViewTopicPage,
    CommunityPage,
    AddproductPage, 
    ViewproductPage,
    MarketPage,
    SearchPage, 
    ProfilePage, 
    ReplyTopicPage,
    MyshopPage,
    MessagesPage, 
    RegisterPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    InAppBrowser,
    File,
    Transfer,
    Camera,
    FilePath,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider
  ]
})
export class AppModule {}
