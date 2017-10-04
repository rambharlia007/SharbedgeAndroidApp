import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccaPage } from './acca';

@NgModule({
  declarations: [
    AccaPage,
  ],
  imports: [
    IonicPageModule.forChild(AccaPage),
  ],
  exports: [
    AccaPage
  ]
})
export class AccaPageModule {}
