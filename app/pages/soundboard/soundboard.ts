import {Component} from '@angular/core';
import {Http} from '@angular/http';


@Component({
  templateUrl: 'build/pages/soundboard/soundboard.html'
})
export class SoundboardPage {

  /* EDIT THESE */
  title: string = "Soundboard";
  base_url: string = "http://kalis.me";
  sounds_url: string = "/sounds";
  randomColours: boolean = false;

  /* Icon Colours */
  /* EDIT THESE */
  colours: Array<string> = [
    "red",
    "blue",
    "green",
    "purple",
    "cyan"
  ];
  colour: string = "black";

  sounds: any = [];
  media: any = null;
  constructor(public http: Http) {
    this.http.get(this.base_url + this.sounds_url)
      .subscribe(
        data => {
          let content: string = data.text();
          let doc: any = document.createElement("html");
          doc.innerHTML = content;
          let links: any = doc.getElementsByTagName("a");
          for(let link of links) {
            this.sounds.push({
              title: link.innerHTML,
              file: this.base_url + link.getAttribute("href")
            });
          }
        },
        err => console.error('There was an error: ' + err),
        () => console.log('Get request completed')
       );
  }

  colourStyle() {
    if(this.randomColours) {
      let colour: string = this.colours[Math.floor(
                                        Math.random() * this.colours.length)];
      return {color: colour};
    }
    return {color: this.colour};
  }

  play(sound) {
    console.log(sound)
    if(this.media) {
      this.media.pause();
    }
    this.media = new Audio();
    this.media.src = sound.file;
    this.media.load();
    this.media.play();
  }
}
