import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { rowViewModel } from '../../shared/row';
/**
 * Generated class for the AccaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-acca',
  templateUrl: 'acca.html',
})
export class AccaPage {
  fixtures : rowViewModel[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
       this.fixtures = navParams.get("accaFixtures")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccaPage');
  }
}
