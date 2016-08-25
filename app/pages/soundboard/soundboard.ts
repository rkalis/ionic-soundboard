import {Component} from '@angular/core';
import {Http} from '@angular/http';


@Component({
  templateUrl: 'build/pages/soundboard/soundboard.html'
})
export class SoundboardPage {
  title: string = "Soundboard";
  base_url: string = "http://kalis.me";
  sounds_url: string = "/sounds";

  colours: Array<string> = [
    "red",
    "blue",
    "green",
    "purple",
    "cyan"
    ];
  sounds: any = [];
  constructor(public http: Http) {
    http.get(this.base_url + this.sounds_url)
      .subscribe(
        data => {
          let content: string = data.text();
          let doc: any = document.createElement("html");
          doc.innerHTML = content;
          let links: any = doc.getElementsByTagName("a");
          for(var i = 0; i < links.length; i++) {
              this.sounds.push({
                  title: links[i].innerHTML,
                  file: this.base_url + links[i].getAttribute("href")
              });
          }
        },
        err => console.error('There was an error: ' + err),
        () => console.log('Get request completed')
       );

  }
  colourStyle(mode) {
    if(mode == "random") {
      let colour: string = this.colours[Math.floor(Math.random()*this.colours.length)];
      return {color: colour}
    }
    return {color: 'black'};
  }
}
