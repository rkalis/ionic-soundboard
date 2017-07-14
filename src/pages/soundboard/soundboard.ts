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
  sounds_url: string = "/sounds";

  sounds: any = [];
  media: any = null;

  constructor(public http: Http, public favouritesData: FavouritesData) {
    this.http.get(this.base_url + this.sounds_url)
      .subscribe(
        data => {
          /* Create a webpage out of the data from the http.get request */
          let content: string = data.text();
          let doc: any = document.createElement("html");
          doc.innerHTML = content;

          /* Extract all "a" tags from it */
          let links: any = doc.getElementsByTagName("a");

          /* Loop through them, saving their title and sound file */
          for(let link of links) {
            let filename = link.getAttribute("href")
            if(filename.startsWith("/")) {
              filename = this.base_url + filename
            }
            else {
              filename = this.base_url + this.sounds_url + "/" + filename
            }
            this.sounds.push({
              title: link.innerHTML,
              file: filename,
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
    console.log(this.media);
  }

  stop(sound) {
    if(sound.isPlaying) {
      this.media.pause();
    }
  }

  toggleFavourite(sound) {
    this.favouritesData.toggleFavourite(sound);
    console.log(this.favouritesData.getAllFavourites());
  }

}
