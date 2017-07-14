import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Injectable()
export class FavouritesData {
  _favourites: any[] = [];

  constructor(public events: Events, public storage: Storage) {
    /* When storage is ready, load all favourites into the app */
    this.storage.ready().then(() => {
      this.storage.forEach((value: any, key: string) => {
        console.log(key, value);
        if(key.startsWith("favourites:")) {
          this._favourites.push(value);
        }
      })

    });
  }

  clearStorage() {
    this.storage.clear();
    this._favourites = [];
  }

  /* Checks if sound with name already exists in favourites */
  hasFavourite(sound: any): boolean {
    return this.findWithAttr(this._favourites, "title", sound.title) != -1;
  };

  /* Adds new sound to favourites and storage */
  addFavourite(sound: any): void {
    this.storage.set("favourites:" + sound.title, sound);
    this._favourites.push(sound);
  };

  /* Removes sound from favourites and storage */
  removeFavourite(sound: any): void {
    let index = this.findWithAttr(this._favourites, "title", sound.title);
    if (index > -1) {
      this._favourites.splice(index, 1);
      this.storage.remove("favourites:" + sound.title);
    }
  };

  /* Adds favourite if it didn't exist yet, removes it otherwise */
  toggleFavourite(sound: any): void {
    let index = this.findWithAttr(this._favourites, "title", sound.title);
    if (index > -1) {
      this.removeFavourite(sound);
    } else {
      this.addFavourite(sound);
    }
  }

  /* Returns all favourites */
  getAllFavourites() {
    return this._favourites;
  }

  /* Helper function to find elements in an array for which attr == value */
  findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
  }
}
