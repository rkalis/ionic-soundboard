import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { FavouritesData } from '../../providers/favouritesdata';
import { CacheService } from '../../providers/cache.service';
import { Media } from '@ionic-native/media';


@Component({
  templateUrl: 'soundboard.html'
})
export class SoundboardPage {

  /* EDIT THESE */
  title: string = "Ionic Soundboard";
  base_url: string = "http://kalis.me";
  sounds_file: string = "/sounds.json"

  sounds: any = [];
  media: any = null;

  constructor(public http: Http, public favouritesData: FavouritesData, public cacheService: CacheService, public mediaService: Media) {
    this.cacheService.ready().then(() => {
      this.cacheService.getCache().forEach(cachedSound => {
        cachedSound.isPlaying = false;
        this.sounds.push(cachedSound);
      });

      this.http.get(this.base_url + this.sounds_file)
      .subscribe(
        data => {
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
            if (!sound.file.startsWith("http")) {
              if (!sound.file.startsWith("/")) {
                sound.file = "/" + sound.file;
              }
              sound.file = this.base_url + sound.file;
            }
            if (!this.cacheService.hasInCache(sound)) {
              this.sounds.push({
                title: sound.title,
                src: sound.file,
                isPlaying: false
              })
            }
          });
        },
        err => console.error('There was an error: ' + err),
        () => console.log(this.sounds)
       );
    });
  }

  /* Plays a sound, pausing other playing sounds if necessary */
  play(sound) {
    console.log(sound);
    this.cacheService.addToCache(sound);

    if (this.media) {
      this.stop(sound);
    }

    this.media = this.mediaService.create(sound.src);
    this.media.statusCallback = status => {
      console.log(status);
      if (status == 1 || status == 2) {
        sound.isPlaying = true;
      } else if (status == 3 || status == 4) {
        sound.isPlaying = false;
      }
    }
    this.media.play();
    // this.media.onStatusUpdate.subscribe(status => {
    //   console.log(status);
    //   if (status == this.mediaService.create("test").statusCallback || status == 2) {
    //     sound.isPlaying = true;
    //   } else if (status == 3 || status == 4) {
    //     sound.isPlaying = false;
    //   }
    // });
    // console.log(this.media);
    // this.media.play();

    // if (this.cacheService.hasInCache(sound)) {
    //   this.playCachedSound(sound);
    // } else {
    //   this.cacheService.addToCache(sound);
    //   this.playRemoteSound(sound);
    // }
  }

  playRemoteSound(sound) {
    this.media = new Audio(sound.file);

    /* Adding event listeners to update the sounds isPlaying attribute accordingly */
    this.media.onended = () => {
      sound.isPlaying = false;
    }
    this.media.onpause = () => {
      sound.isPlaying = false;
    }
    this.media.onplay = () => {
      sound.isPlaying = true;
    }

    this.media.load();
    this.media.play();
  }

  playCachedSound(sound) {
    let cachedSound = this.cacheService.getFromCache(sound);
    console.log(cachedSound);
    this.media = this.mediaService.create(cachedSound.file);
    this.media.onStatusUpdate.subscribe(status => {
      console.log(status);
      if (status == 1) {
        sound.isPlaying = true;
      } else if (status == 3 || status == 4) {
        sound.isPlaying = false;
      }
    });
    console.log(this.media);
    this.media.play();
  }

  /* Stops the playback of the sound */
  stop(sound) {
    /* Stop playback, unsubscribe from Observables,
     * release the audio, and set it to null
     */
    if (this.media) {
      this.media.stop();
      if (this.media.release) {
        this.media.statusCallback = null;
        this.media.release();
      }
      this.media = null;
    }
  }

  /* Toggle a sound as favourite */
  toggleFavourite(sound) {
    this.favouritesData.toggleFavourite(sound);
    console.log(this.favouritesData.getAllFavourites());
  }

  /* Lists all favourited sounds */
  listFavouriteSounds() {
    let allFavourites = this.favouritesData.getAllFavourites();
    return allFavourites;
  }

  /* Lists all sounds not marked as favourite */
  listRegularSounds() {
    let regularSounds = this.sounds.filter(sound => !this.favouritesData.hasFavourite(sound));
    return regularSounds;
  }

  /* List all sounds, favourites first */
  listSortedSounds() {
    return this.listFavouriteSounds().concat(this.listRegularSounds());
  }

}
