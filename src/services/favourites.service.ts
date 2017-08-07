import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


@Injectable()
export class FavouritesService {
  _favourites: any[] = [];
  _ready: Promise<any>;

  constructor(private storage: Storage) {
    /* When storage is ready, load all favourites into the app */
    this._ready = new Promise((resolve, reject) => {
      this.storage.ready().then(() => {
        this.storage.forEach((value: any, key: string) => {
          if (key.startsWith('favourites:')) {
            this._favourites.push(value);
          }
        }).then(() => resolve()).catch(error => reject(error));
      }).catch(error => reject(error));
    });
  }

  ready(): Promise<any> {
    return this._ready;
  }

  clearFavourites() {
    this.getAllFavourites()
      .forEach(favourite => this.removeFavourite(favourite));
  }

  /* Checks if sound with name already exists in favourites */
  hasFavourite(sound: any): boolean {
    return this.getAllFavourites().findIndex(favourite => favourite.title === sound.title) > -1;
  }

  /* Adds new sound to favourites and storage */
  addFavourite(sound: any): void {
    this.storage.set('favourites:' + sound.title, sound);
    this._favourites.push(sound);
  }

  /* Removes sound from favourites and storage */
  removeFavourite(sound: any): void {
    const index = this.getAllFavourites().findIndex(favourite => favourite.title === sound.title);
    if (index > -1) {
      this._favourites.splice(index, 1);
      this.storage.remove('favourites:' + sound.title);
    }
  }

  /* Adds favourite if it didn't exist yet, removes it otherwise */
  toggleFavourite(sound: any): void {
    if (this.hasFavourite(sound)) {
      this.removeFavourite(sound);
    } else {
      this.addFavourite(sound);
    }
  }

  /* Returns all favourites */
  getAllFavourites() {
    return this._favourites;
  }
}
