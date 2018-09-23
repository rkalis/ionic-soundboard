import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


@Injectable()
export class FavouritesService {
  _favourites: any[] = [];
  _ready: Promise<any>;

  constructor(
    private storage: Storage
  ) {
    /* When storage is ready, load all favourites into the app */
    this._ready = new Promise((resolve, reject) => {
      return this.storage.ready()
      .then(() => {
        return this.storage.get('favourites')
        .then(value => {
          if (value) {
            this._favourites = value;
          }
        });
      });
    });
  }

  ready(): Promise<any> {
    return this._ready;
  }

  clearFavourites() {
    this._favourites = [];
    this.storage.set('favourites', this.getAllFavourites());
  }

  /* Checks if sound with name already exists in favourites */
  hasFavourite(sound: any): boolean {
    return this.getAllFavourites().findIndex(favourite => favourite === sound.title) > -1;
  }

  /* Adds new sound to favourites and storage */
  addFavourite(sound: any): Promise<any> {
    this.getAllFavourites().push(sound.title);
    return this.storage.set('favourites', this.getAllFavourites());
  }

  /* Removes sound from favourites and storage */
  removeFavourite(sound: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const index = this.getAllFavourites().findIndex(favourite => favourite === sound.title);
      if (index < 0) {
        return reject(sound.title + ' not in favourites');
      }
      this.getAllFavourites().splice(index, 1);
      return this.storage.set('favourites', this.getAllFavourites());
    });
  }

  /* Adds favourite if it didn't exist yet, removes it otherwise */
  toggleFavourite(sound: any): Promise<any> {
    if (this.hasFavourite(sound)) {
      return this.removeFavourite(sound);
    } else {
      return this.addFavourite(sound);
    }
  }

  /* Returns all favourites */
  getAllFavourites() {
    return this._favourites;
  }
}
