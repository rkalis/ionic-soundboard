import {Component} from '@angular/core';
import {ionicBootstrap, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {SoundboardPage} from './pages/soundboard/soundboard';


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
class SoundboardApp {
  rootPage: any = SoundboardPage;

  constructor(
    public platform: Platform
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(SoundboardApp);
