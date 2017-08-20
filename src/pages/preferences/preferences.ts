import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'preferences.html'
})
export class PreferencesPage {
  constructor(private viewCtrl: ViewController) {

  }

  dismiss() {
    const data = {
      reload: true
    };
    this.viewCtrl.dismiss(data);
  }
}
