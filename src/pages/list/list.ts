import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http'
import { rowViewModel } from '../../shared/row';
import { PageViewModel } from '../../shared/page';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map'
import { AlertController } from 'ionic-angular';
import { NgZone } from '@angular/core';
import { AccaPage } from '../acca/acca';
import { OddsCutPage } from '../odds-cut/odds-cut';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Login } from '../login/login';
import { SubscribePage } from '../subscribe/subscribe';
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  fixtures: rowViewModel[] = [];
  pageIndex: any;
  counter: any;
  isPreviousDisabled: any = true;
  isNextDisabled: any = false;
  paginationButtons: any[] = [];
  totalRecords: any;
  pagination: PageViewModel[] = [];
  pageLimit: number = 100;
  totalPage: any;
  headerFooterVisible: boolean = false;
  isSearch = false;
  totalSummaryText: string;
  sharbTypeId;
  updatedAt: string;
  pageTitle: string;
  baseUrl: string = "http://www.sharbedge.co.uk/";
  testBaseUrl: string = "http://localhost:6788/";
  IsServerDataAvailable: boolean;
  gridErrorMessage: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,
    public alertCtrl: AlertController, private _zone: NgZone, public loadingCtrl: LoadingController, private storage: Storage, private iab: InAppBrowser) {
    // If we navigated to this page, we will have an item available as a nav param
    this.sharbTypeId = navParams.get("id");
    this.pageTitle = navParams.get("title");
  }

  setLastUpdatedTime() {
    var currentTime = new Date().toLocaleTimeString('en-GB',
      {
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      });
    this.updatedAt = "Last updated: " + currentTime
  }

  searchValue: string = "";
  backOddsUnderValue: string = "5";
  backOddsOverValue: string = "1";
  sortBy1: string = "ARB DESC";
  sortBy2: string = "EventDateTime ASC";
  clearFilterSettings() {
    this.searchValue = "";
    this.backOddsUnderValue = "";
    this.backOddsOverValue = "";
    this.sortBy2 = "";
    this.getFixtures(true);
  }

  closeFilterSettings() {
    this.headerFooterVisible = false;
    this.searchValue = "";
  }

  commissionValue: string = "";
  subscription
  ngOnInit() {
    this.IsServerDataAvailable = true;
    this.counter = 1;
    this.storage.get('commission').then(val => {
      this.commissionValue = val;
      this.getFixtures();
    });

    let timer = Observable.timer(30000, 30000);
    this.subscription = timer.subscribe(t => {
      if (this.navCtrl.getActive().name == "ListPage" && !this.headerFooterVisible) {
        this.updateFixtures();
        this.setLastUpdatedTime();
      }
    });
  };

  //http://ads.betfair.com/redirect.aspx?pid=42135&bid=9890&redirecturl=https://www.betfair.com/exchange/football/event/28156181/market?marketId=1.130390853
  betFairLink(data: rowViewModel) {
    var urlValue = "http://ads.betfair.com/redirect.aspx?pid=42135&bid=9890&redirecturl=https://www.betfair.com/exchange/football/event/" + data.EventId + "/market?marketId=" + data.MarketId;
    const browser = this.iab.create(urlValue, "_blank", "location=yes");
  }


  updateFixtures() {
    this.IsServerDataAvailable = true;
    var headers = new Headers();
    this.storage.get('Accesskey').then(val => {
      headers.append('Authorization', 'Bearer ' + val);
      var options = new RequestOptions({ headers: headers });
      var queryParams = "?param=" + this.commissionValue + "&param1=" + this.searchValue + "&param2=" + this.backOddsOverValue + "&param3=" + this.backOddsUnderValue + "&param4=" + this.sortBy1
        + "&param5=" + this.sortBy2 + "&param6=" + this.counter;
      this.http.get(this.baseUrl + "api/Values/GetFixturesByQuery/" + this.sharbTypeId + queryParams, options).map(data => data.json())
        .subscribe(data => {
          this.fixtures = [];
          if (data.Data.result.length > 0) {
            data.Data.result.forEach((element, index) => {
              var x = new rowViewModel(element);
              x.IsSelected = this.accaFixtures.findIndex(z => z.Id == x.Id) !== -1
              this.fixtures.push(x)
            });
            this.totalRecords = this.fixtures[0].TotalRecords;
            this.ProcessPageIndex();
          } else {
            this.gridErrorMessage = "No data available.";
            this.IsServerDataAvailable = false;
          }
        },
        err => {

          if (err.status == 401) {
            var response = JSON.parse(err.json());
            this.loader.dismiss();
            this.showAlert(response.title, response.subtitle)
            if (response.id == "1" || response.id == "2") {
              this.subscription.unsubscribe();
              this.storage.clear();
              this.navCtrl.setRoot(Login);
            }
            if (response.id == "3") {
              this.subscription.unsubscribe();
              this.navCtrl.setRoot(SubscribePage);
            }
          } else {
            this.gridErrorMessage = "Oops something went wrong. Please check your internet connection and try again.";
            this.IsServerDataAvailable = false;
          }
        });
    })
  }

  goToPrevious(v) {
    this.counter -= 1;
    if (this.counter == 1)
      this.isPreviousDisabled = true;
    if (this.counter < this.totalPage)
      this.isNextDisabled = false;
    this.getFixtures(true);
  }

  goToNext(v) {
    this.counter += 1;
    if (this.counter == this.totalPage) {
      this.isNextDisabled = true;
    }
    if (this.counter > 1)
      this.isPreviousDisabled = false;
    this.getFixtures(true);
  }

  goToPage(v) {
    this.counter = parseInt(v);
    if (this.counter == 1) {
      this.isPreviousDisabled = true;
      this.isNextDisabled = false;
    }
    else if (this.counter == this.totalPage) {
      this.isPreviousDisabled = false;
      this.isNextDisabled = true;
    }
    else {
      this.isPreviousDisabled = false;
      this.isNextDisabled = false;
    }
    this.getFixtures(true);
  }

  ProcessPageIndex() {
    this.totalPage = Math.ceil(this.fixtures[0].TotalRecords / this.pageLimit);
    var mean = Math.round(this.totalPage / 3);
    var currentCounter = this.counter;
    var x;
    if (currentCounter <= mean) {
      x = [currentCounter, currentCounter + mean, currentCounter + 2 * mean];
    }
    if (currentCounter > mean) {
      x = [currentCounter - mean, currentCounter, currentCounter + mean];
    }

    for (var i = 0; i < this.pagination.length; i++) {
      var isVis = x.indexOf(i + 1) > -1
      this.pagination[i].isVisible = isVis;
    }
    this.pageIndex = this.counter.toString();
  }

  processPagination(fixtureData: rowViewModel[]) {
    var tempPagination = [];
    this.totalPage = Math.ceil(fixtureData[0].TotalRecords / this.pageLimit);
    var mean = Math.round(this.totalPage / 3);
    var index = [0, mean, 2 * mean];
    this.isNextDisabled = this.totalPage == 1;
    if (this.pagination.length == 0) {
      for (var i = 0; i < this.totalPage; i++) {
        var isVis = index.indexOf(i) > -1
        var x = new PageViewModel({ id: i + 1, isVisible: isVis, isDisabled: false });
        tempPagination.push(x);
      }
      this.pagination = tempPagination;
      this.counter = 1;
      this.pageIndex = "1";
    }
  }

  // { headers: this.headers}
  // http://www.sharbedge.co.uk/api/Values/
  getFixtures(IsPaginationData: boolean = false) {
    this.IsServerDataAvailable = true;
    this.fixtures = [];
    this.presentLoading();
    var headers = new Headers();
    this.storage.get('Accesskey').then((val) => {
      headers.append('Authorization', 'Bearer ' + val);
      var options = new RequestOptions({ headers: headers }); //data.Data.result
      var queryParams = "?param=" + this.commissionValue + "&param1=" + this.searchValue + "&param2=" + this.backOddsOverValue + "&param3=" + this.backOddsUnderValue + "&param4=" + this.sortBy1
        + "&param5=" + this.sortBy2 + "&param6=" + this.counter;
      this.http.get(this.baseUrl + "api/Values/GetFixturesByQuery/" + this.sharbTypeId + queryParams, options).map(res => res.json())
        .subscribe(data => {
          if (data.Data.result.length > 0) {
            data.Data.result.forEach((element, index) => {
              var x = new rowViewModel(element);
              x.IsSelected = this.accaFixtures.findIndex(z => z.Id == x.Id) !== -1
              this.fixtures.push(x)
            });
            this.totalRecords = this.fixtures[0].TotalRecords;
            if (IsPaginationData)
              this.ProcessPageIndex();
            else
              this.processPagination(this.fixtures);
          } else {
            this.gridErrorMessage = "No data available.";
            this.IsServerDataAvailable = false;
          }
          this.headerFooterVisible = false;
          this.loader.dismiss();
          this.setLastUpdatedTime();
        },
        err => {
          if (err.status == 401) {
            var response = JSON.parse(err.json());
            this.loader.dismiss();
            this.showAlert(response.title, response.subtitle)
            if (response.id == "1" || response.id == "2") {
              this.subscription.unsubscribe();
              this.storage.clear();
              this.navCtrl.setRoot(Login);
            }
            if (response.id == "3") {
              this.subscription.unsubscribe();
              this.navCtrl.setRoot(SubscribePage);
            }
          }
          else {
            this.gridErrorMessage = "Oops something went wrong. Please check your internet connection and try again.";
            this.IsServerDataAvailable = false;
            this.loader.dismiss();
          }
        });
    })
  }

  showAlert(title: string, subTitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }


  loader;
  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 30000,
    });
    this.loader.present();
  }

  goToAccaPage() {
    this.navCtrl.push(AccaPage, { accaFixtures: this.accaFixtures });
  }

  clearAccaPage() {
    this.fixtures.forEach(e => e.IsSelected = false);
    this.accaFixtures = [];
  }

  accaFixtures: rowViewModel[] = [];
  AddAccaList(data: rowViewModel) {
    console.log("AddAccaList")
    if (data.IsSelected)
      this.accaFixtures.push(data);
    else {
      let index: number = this.accaFixtures.findIndex(x => x.Id == data.Id)
      if (index !== -1) {
        this.accaFixtures.splice(index, 1);
      }
    }
  }

  UpdateOdds(data: rowViewModel) {
    this.navCtrl.push(OddsCutPage, { data: data });
  }


  selectRow(data: rowViewModel) {
    var tempIsSelected = (!data.IsSelected);
    data.IsSelected = tempIsSelected;
    this.fixtures.find(x => x.Id == data.Id).IsSelected = tempIsSelected
    this.AddAccaList(data);
  }

  showSearchBar() {
    var isSearchVisible = !(this.headerFooterVisible);
    this.headerFooterVisible = isSearchVisible;
  }
}
