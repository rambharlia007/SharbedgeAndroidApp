import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OddsCutPage } from './odds-cut';

@NgModule({
  declarations: [
    OddsCutPage,
  ],
  imports: [
    IonicPageModule.forChild(OddsCutPage),
  ],
  exports: [
    OddsCutPage
  ]
})
export class OddsCutPageModule {}
