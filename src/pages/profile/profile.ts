import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ListPage } from '../list/list';
import { Login } from '../login/login';
import { Http, Headers, RequestOptions } from '@angular/http'
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map'
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
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
  commissionValue: string;
  isEmailAlert: boolean;
  baseUrl: string = "http://www.sharbedge.co.uk/";
  testBaseUrl: string = "http://localhost:6788/";
  alertMailId: string;
  loader: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,
    private storage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.storage.get('commission')
      .then(val => {
        console.log(val);
        this.commissionValue = val.toString();
      });
    this.storage.get('isEmailAlert')
      .then(val => {
        console.log(val);
        this.isEmailAlert = val;
      });
    this.storage.get('emailAlertId')
      .then(val => {
        console.log(val);
        this.alertMailId = val;
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Profile');
  }


  UpdateCommission($event) {
    this.storage.set('commission', $event);
  }

  SaveSettings() {
    this.presentLoading();
    var headers = new Headers();
    this.storage.get('Accesskey').then(val => {
      headers.append('Authorization', 'Bearer ' + val);
      var options = new RequestOptions({ headers: headers });
      this.http.get(this.baseUrl + "api/Values/SaveUserSettings?param=" + this.commissionValue + "&param1=" + this.alertMailId + "&param2=" + this.isEmailAlert, options)
        .map(response => response.json())
        .subscribe(response => {
          this.loader.dismiss();
          this.showAlert("Update done!","User settings updated successfully.");
        }, err => {
          this.loader.dismiss()
          this.showAlert("Update failed!","Oops internal server error. please try again");
        });
    })
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Updating...",
      duration: 30000,
      dismissOnPageChange: true
    });
    this.loader.present();
  }

  showAlert(title:string, subTitle:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }

  Logout() {
    this.storage.clear();
    this.navCtrl.setRoot(Login);
  }
}
