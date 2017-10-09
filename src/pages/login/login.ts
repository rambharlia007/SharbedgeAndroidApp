import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpModule, Http, Headers } from '@angular/http'
import { ListPage } from '../list/list';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
  pages: any;
  accessToken: string;
  errorMessage: string;
  loader;
  //http://localhost:6788/
  //http://www.sharbedge.co.uk/
  baseUrl: string = "http://www.sharbedge.co.uk/";
  testBaseUrl:string = "http://localhost:6788/";
  private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, private storage: Storage, private iab: InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

  // http://www.sharbedge.co.uk/Token
  SignIn(userName: string, password: string) {
    this.presentLoading();
    var params = "grant_type=password&username=" + userName + "&password=" + password;
    var response = this.http.post(this.baseUrl + "Token", params, { headers: this.headers })
      .map(res => res.json()).subscribe(data => {
        this.accessToken = data.access_token;
        var commissionPercentage = data.commission_percentage;
        var isEmailAlert = data.is_emailAlert;
        var emailAlertId = data.email_alert_id;
        if (this.accessToken != null) {
          this.storage.set('Accesskey', this.accessToken);
          this.storage.set('isLoggedIn', "true");
          this.storage.set('commission', commissionPercentage);
          this.storage.set('isEmailAlert', isEmailAlert);
          this.storage.set('emailAlertId', emailAlertId);
          this.navCtrl.setRoot(HomePage);
        } else {
          this.loader.dismiss()
          this.showAlert();
          this.errorMessage = "Username or Password is not correct"
        }
      },
      err => {
        this.loader.dismiss()
        this.showAlert();
        this.errorMessage = "Username or Password is not correct"
      });
  }

  redirectToPaypal(urlValue: string) {
    const browser = this.iab.create(urlValue, "_blank", "location=yes");
  }



  Register() {
    const browser = this.iab.create("https://www.sharbedge.com/Account/Register", "_blank", "location=yes");
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Invalid credentials!',
      subTitle: 'Username or Password is not correct',
      buttons: ['OK']
    });
    alert.present();
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 30000,
      dismissOnPageChange: true
    });
    this.loader.present();
  }
  ngOnChange() {
    this.pages = this.navParams.get("pages");
  }
}
