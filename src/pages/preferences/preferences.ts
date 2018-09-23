import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { PreferencesService } from '../../services/preferences.service';
import { CacheService } from '../../services/cache.service';

@Component({
  templateUrl: 'preferences.html'
})
export class PreferencesPage {
  cachingEnabled: boolean;

  constructor(
    private cacheService: CacheService,
    private preferencesService: PreferencesService,
    private viewCtrl: ViewController
  ) {
    this.cachingEnabled = this.preferencesService.get('cachingEnabled');
  }

  dismiss() {
    const data = {
      reload: true
    };

    if (this.preferencesService.get('cachingEnabled') && !this.cachingEnabled) {
      this.cacheService.clearCache();
    }
    this.preferencesService.set('cachingEnabled', this.cachingEnabled)
    .then(() => {
      this.viewCtrl.dismiss(data);
    })
    .catch(error => console.log(error));
  }
}
