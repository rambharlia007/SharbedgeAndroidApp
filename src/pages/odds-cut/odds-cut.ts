import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { rowViewModel } from '../../shared/row';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the OddsCutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-odds-cut',
  templateUrl: 'odds-cut.html',
})
export class OddsCutPage {
  isRowSelected: any;
  OddsValue;
  fixtureData: rowViewModel;
  oddsUpdateData = [];
  showMessage: boolean = false;
  message: string;
  commission: number = 0;
  backStake: number = 100;
  layStack: number;
  profit: number;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, private storage: Storage) {
    this.fixtureData = navParams.get("data");
    this.OddsValue = "1/10";
    this.isRowSelected;
    this.GetFixturesActivityLog();
    this.compute("5", "commission");
    this.storage.get('commission').then((val) => {
      this.commission = parseInt(val)
    });
    if (this.commission == 0)
      this.commission = 5;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OddsCutPage');
  }


  compute(value: any, property: string) {
    if (value !== "") {
      this[property] = parseInt(value);
      console.log(this.commission, this.backStake);
      var layStack = this.backStake *
        ((this.fixtureData.BackOdds) / (this.fixtureData.LayOdds - (this.commission / 100)));
      var profit = ((this.backStake * this.fixtureData.BackOdds) - (layStack * (this.fixtureData.LayOdds - 1))) - this.backStake;
      this.layStack = parseFloat(layStack.toFixed(2));
      this.profit = parseFloat(profit.toFixed(2));
    }
  }

  GetFixturesActivityLog() {
    var headers = new Headers();
    this.storage.get('Accesskey').then(val => {
      headers.append('Authorization', 'Bearer ' + val);
      var options = new RequestOptions({ headers: headers });
      this.http.get("http://www.sharbedge.co.uk/api/Values/GetFixturesActivityLogById/" + this.fixtureData.Id, options).map(response => response.json())
        .subscribe(response => {
          if (response != null && response.Data != null && response.Data.result.length > 0) {
            var lastIndex = response.Data.result.length - 1;
            this.oddsUpdateData = response.Data.result;
            this.isRowSelected = this.oddsUpdateData[lastIndex].Id;
            this.OddsValue = this.oddsUpdateData[lastIndex].BackOddsFraNew;
          }
        });
    })
  }


  UpdateOddsCut() {
    this.presentLoading();
    var updateFixture = this.fixtureData;
    updateFixture.BackOddsFra = this.OddsValue;
    var temp = this.OddsValue.split("/");
    var backOdds = (parseInt(temp[0]) / parseInt(temp[1])) + 1;
    updateFixture.BackOdds = parseFloat(backOdds.toFixed(2));
    var headers = new Headers();
    headers.append('Content-Type', 'application/json')
    this.storage.get('Accesskey').then(val => {
      headers.append('Authorization', 'Bearer ' + val);
      var options = new RequestOptions({ headers: headers });
      var response = this.http.post("http://www.sharbedge.co.uk/api/Values/Save", JSON.stringify(updateFixture), options)
        .map(res => res.json()).subscribe(response => {
          if (response.Data != null && response.Data.message) {
            this.message = response.Data.message;
            this.showMessage = true;
            if (response.Data.fixtureLogs.length > 0) {
              var lastIndex = response.Data.fixtureLogs.length - 1;
              this.oddsUpdateData = response.Data.fixtureLogs;
              this.isRowSelected = this.oddsUpdateData[lastIndex].Id;
              this.OddsValue = this.oddsUpdateData[lastIndex].BackOddsFraNew;
              this.oddsUpdateData = response.Data.fixtureLogs;
            }
            this.loader.dismiss();
          }
        });
    })
  }

  loader;
  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 10000,
      dismissOnPageChange: true
    });
    this.loader.present();
  }
} 