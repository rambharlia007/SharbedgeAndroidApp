import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ListPage } from '../list/list';
import { Login } from '../login/login';
import {Http} from '@angular/http'
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map'
import { Storage } from '@ionic/storage';
/**
 * Generated class for the Profile page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class Profile {

  constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http,private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Profile');
  }
   

  UpdateCommission($event){
     this.storage.set('commission', $event);
  }

   Logout(){
     this.storage.clear();
     this.navCtrl.setRoot(Login);
   }
}
