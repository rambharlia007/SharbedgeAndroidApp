import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { Profile } from '../pages/profile/profile';
import { Login } from '../pages/login/login';
import { SubscribePage } from '../pages/subscribe/subscribe';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  pages: Array<{ title: string, component: any, id: number }>;
  isLoggedIn = localStorage.getItem('isLoggedIn');

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private storage: Storage) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage, id: 5 },
      { title: 'SF', component: ListPage, id: 1 },
      { title: 'AF', component: ListPage, id: 2 },
      { title: 'OF', component: ListPage, id: 3 },
      { title: 'FBF', component: ListPage, id: 4 },
      { title: 'Subscribe', component: SubscribePage, id: 7 },
      { title: 'Profile', component: Profile, id: 6 },
    ];
    this.storage.get('Accesskey').then((val) => {
      if (val == "" || val == null) {
        this.rootPage = Login;
      }
      else this.rootPage = HomePage;
    });
  }
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, { id: page.id, title: page.title });
  }
}
