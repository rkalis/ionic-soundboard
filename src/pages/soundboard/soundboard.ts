import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { FavouritesData } from '../../providers/favouritesdata';


@Component({
  templateUrl: 'soundboard.html'
})
export class SoundboardPage {

  /* EDIT THESE */
  title: string = "Soundboard";
  base_url: string = "http://kalis.me";
  sounds_url: string = "/sounds";
  randomColours: boolean = false;

  /* Icon Colours */
  /* EDIT THESE */
  colour: string = "black";
  colours: Array<string> = [
    "red",
    "blue",
    "green",
    "purple",
    "cyan"
  ];

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
              file: filename
            });
          }
        },
        err => console.error('There was an error: ' + err),
        () => console.log('Get request completed')
       );
  }

  /* returns an ngStyle-compliant object containing either a random colour
   * or a specific colour, depending on set variables
   */
  colourStyle() {
    if(this.randomColours) {
      let colour: string = this.colours[Math.floor(Math.random() * this.colours.length)];
      return {color: colour};
    }
    return {color: this.colour};
  }

  /* Plays a sound, pausing other playing sounds if necessary */
  play(sound) {
    console.log(sound)
    if(this.media) {
      this.media.pause();
    }
    this.media = new Audio(sound.file);
    this.media.load();
    this.media.play();
  }

  toggleFavourite(sound) {
    this.favouritesData.toggleFavourite(sound);
    console.log(this.favouritesData.getAllFavourites())
  }

}
