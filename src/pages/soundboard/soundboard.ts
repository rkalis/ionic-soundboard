import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { CacheService } from '../../services/cache.service';
import { FavouritesService } from '../../services/favourites.service';
import { Media } from '@ionic-native/media';
import { NgZone } from '@angular/core';


@Component({
  templateUrl: 'soundboard.html'
})
export class SoundboardPage {

  /* EDIT THESE */
  title = 'Ionic Soundboard';
  base_url = 'http://kalis.me';
  sounds_file = '/sounds.json';

  sounds: any = [];
  media: any = null;

  constructor(private http: Http, public favouritesService: FavouritesService, private mediaService: Media,
              private cacheService: CacheService, private zone: NgZone) {
    this.cacheService.ready().then(() => {
      this.cacheService.getCache().forEach(cachedSound => {
        cachedSound.isPlaying = false;
        this.sounds.push(cachedSound);
      });
      this.getRemoteSounds();
    }).catch(error => console.log(error));
  }

  /* Gets all sounds found at this.base_url + this.sounds_file */
  getRemoteSounds() {
    this.http.get(this.base_url + this.sounds_file)
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
            sound.file = this.base_url + sound.file;
          }

          /* If the file is not already in the cache or it is, but outdated,
           * only then does the remote sound get added to the list
           */
          if (!this.cacheService.hasInCache(sound) ||
              this.cacheService.isOutdated(sound)) {
            this.sounds.push({
              title: sound.title,
              src: sound.file,
              isPlaying: false
            });
          }
        });
      },
      error => console.error(error),
      () => console.log(this.sounds)
      );
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
  cache(sound) {
    /* Adds a sound to the cache, then updates its attributes to reflect its new status */
    return this.cacheService.addToCache(sound)
      .then(cachedSound => {
        sound.src = cachedSound.src;
        sound.remoteSrc = cachedSound.remoteSrc;
        sound.cacheDate = cachedSound.cache;
      }).catch(error => console.log(error));
  }

  /* Clears the entire cache, and reloads all remote sounds */
  clearCacheAndReload() {
    this.cacheService.clearCache()
      .then(() => {
        this.sounds = [];
        this.getRemoteSounds();
      }).catch(error => console.log(error));
  }

  /* Toggle a sound as favourite */
  toggleFavourite(sound) {
    this.favouritesService.toggleFavourite(sound);
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

}
