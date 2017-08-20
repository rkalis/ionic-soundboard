import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { CacheService } from '../../services/cache.service';
import { FavouritesService } from '../../services/favourites.service';
import { PreferencesService } from '../../services/preferences.service';
import { PreferencesPage } from '../preferences/preferences';
import { Media } from '@ionic-native/media';
import { ModalController } from 'ionic-angular';
import { NgZone } from '@angular/core';


@Component({
  templateUrl: 'soundboard.html'
})
export class SoundboardPage {

  title = 'Ionic Soundboard';

  sounds: any = [];
  media: any = null;

  constructor(private http: Http, public favouritesService: FavouritesService, private mediaService: Media,
              private cacheService: CacheService, private preferencesService: PreferencesService,
              private modalCtrl: ModalController, private zone: NgZone) {
    console.log('gonna load cache');
    this.preferencesService.ready()
    .then(() => this.cacheService.ready())
    .then(() => {
      console.log('cache ready');
      return this.load();
    })
    .catch(error => console.log(error));
  }

  load(): Promise<any> {
    this.cacheService.getCache().forEach(cachedSound => {
      cachedSound.isPlaying = false;
      this.sounds.push(cachedSound);
    });
    return this.getRemoteSounds();
  }

  reload(): Promise<any> {
    this.sounds = [];
    return this.load();
  }

  /* Gets all sounds found at this.base_url + this.sounds_file */
  getRemoteSounds(): Promise<any> {
    return new Promise((resolve, reject) => {
      const baseUrl = this.preferencesService.get('baseUrl');
      const soundsFile = this.preferencesService.get('soundsFile');
      console.log(baseUrl, soundsFile);
      if (!baseUrl || !soundsFile) {
        return reject('No base url or sounds file specified');
      }

      this.http.get(baseUrl + soundsFile)
      .subscribe(data => {
        /* Loop through data
          * Format:
          * [
          *   {
          *     "title": "title",
          *     "file": "file"
          *   }
          * ]
          */
        data.json().forEach(sound => {
          /* Example: http://website.com/soundfile.mp3 */
          if (!sound.file.startsWith('http')) {
            if (!sound.file.startsWith('/')) {
              sound.file = '/' + sound.file;
            }
            /* Example: (/)soundfile.mp3 -> http://website.com/soundfile.mp3 */
            sound.file = baseUrl + sound.file;
          }

          /* If the file is not already in the cache or it is, but outdated,
           * only then does the remote sound get added to the list
           */
          if (!this.cacheService.hasInCache(sound)) {
            this.sounds.push({
              title: sound.title,
              src: sound.file,
              isPlaying: false
            });
          }
        });
        return resolve();
      },
      error => reject(error),
      () => console.log(this.sounds)
      );
    });
  }

  /* Plays a sound, pausing other playing sounds if necessary */
  play(sound) {
    this.stopPlayback();

    /* Plays with Cordova Audio if available, falls back on Web Audio */
    if (window.hasOwnProperty('cordova') && window.hasOwnProperty('Media')) {
      this.cache(sound).then(() => this.playWithCordovaAudio(sound));
    } else {
      this.playWithWebAudio(sound);
    }
  }

  playWithWebAudio(sound) {
    this.media = new Audio(sound.src);

    /* Adding event listeners to update the sound's isPlaying attribute accordingly */
    this.media.onended = () => {
      sound.isPlaying = false;
    };
    this.media.onpause = () => {
      sound.isPlaying = false;
    };
    this.media.onplay = () => {
      sound.isPlaying = true;
    };

    this.media.load();
    this.media.play();
  }

  playWithCordovaAudio(sound) {
    this.media = this.mediaService.create(sound.src);

    /* Adding status callback to update the sound's isPlaying attribute accordingly */
    this.media.statusCallback = status => {
      /* Run this in ngZone to propagate changes to the UI */
      this.zone.run(() => {
        switch (status) {
          case this.mediaService.MEDIA_RUNNING:
            sound.isPlaying = true;
            break;
          case this.mediaService.MEDIA_PAUSED:
            sound.isPlaying = false;
            break;
          case this.mediaService.MEDIA_STOPPED:
            sound.isPlaying = false;
            break;
        }
      });
    };

    this.media.play();
  }

  /* Stops the playback of the sound */
  stopPlayback() {
    if (this.media) {
      if (this.media.release) {
        this.media.stop();
        this.media.release();
      } else {
        this.media.pause();
      }
      this.media = null;
    }
  }

  /* Caches a given sound */
  cache(sound): Promise<any> {
    /* Adds a sound to the cache, then updates its attributes to reflect its new status */
    return new Promise((resolve, reject) => {
      if (!this.preferencesService.get('cachingEnabled')) {
        return resolve();
      }

      return this.cacheService.addToCache(sound)
      .then(cachedSound => {
        sound.src = cachedSound.src;
        sound.remoteSrc = cachedSound.remoteSrc;
        sound.cacheDate = cachedSound.cacheDate;
        return resolve();
      })
      .catch(error => console.log(error));
    });
  }

  /* Clears the entire cache, and reloads all remote sounds */
  clearCacheAndReload(): Promise<any> {
    return this.cacheService.clearCache()
    .then(() => this.reload())
    .catch(error => console.log(error));
  }

  /* Toggle a sound as favourite */
  toggleFavourite(sound) {
    return this.favouritesService.toggleFavourite(sound)
    .catch(error => console.log(error));
  }

  /* Lists all favourited sounds */
  listFavouriteSounds() {
    return this.sounds.filter(sound => this.favouritesService.hasFavourite(sound));
  }

  /* Lists all sounds not marked as favourite */
  listRegularSounds() {
    return this.sounds.filter(sound => !this.favouritesService.hasFavourite(sound));
  }

  /* List all sounds, favourites first */
  listSortedSounds() {
    return this.listFavouriteSounds().concat(this.listRegularSounds());
  }

  showPreferences() {
    const preferencesModal = this.modalCtrl.create(PreferencesPage);
    preferencesModal.onDidDismiss(data => {
      if (!data) {
        return;
      }
      if (data.reload) {
        this.reload();
      }
    });
    preferencesModal.present();
  }
}
