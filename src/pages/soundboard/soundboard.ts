import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { FavouritesData } from '../../providers/favouritesdata';


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

  constructor(public http: Http, public favouritesData: FavouritesData) {
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
          for(let link of data.json()) {
            if(!link.file.startsWith("http")) {
              if(link.file.startsWith("/")) {
                link.file = "/" + link.file;
              }
              link.file = this.base_url + link.file;
            }
            this.sounds.push({
              title: link.title,
              file: link.file,
              isPlaying: false
            });
          }
        },
        err => console.error('There was an error: ' + err),
        () => console.log('Get request completed')
       );
  }

  /* Plays a sound, pausing other playing sounds if necessary */
  play(sound) {
    console.log(sound);
    if(this.media) {
      this.media.pause();
    }

    this.media = new Audio(sound.file);
    /* Adding event listeners to update the sounds isPlaying attribute accordingly */
    this.media.onended = function() {
      sound.isPlaying = false;
    }
    this.media.onpause = function() {
      sound.isPlaying = false;
    }
    this.media.onplay = function() {
      sound.isPlaying = true;
    }

    this.media.load();
    this.media.play();
  }

  /* Stops the playback of the sound */
  stop(sound) {
    if(sound.isPlaying) {
      this.media.pause();
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
