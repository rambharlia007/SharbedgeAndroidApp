import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubscribePage } from './subscribe';

@NgModule({
  declarations: [
    SubscribePage,
  ],
  imports: [
    IonicPageModule.forChild(SubscribePage),
  ],
  exports: [
    SubscribePage
  ]
})
export class SubscribePageModule {}
