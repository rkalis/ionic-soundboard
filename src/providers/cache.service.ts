import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';


@Injectable()
export class CacheService {
  _cache: any[] = [];
  fileTransfer: FileTransferObject;

  constructor(public events: Events, public storage: Storage, public transfer: FileTransfer, public file: File) {
    /* When storage is ready, load cache into the app */
    this.storage.ready().then(() => {
      this.storage.forEach((value: any, key: string) => {
        console.log(key, value);
        if (key.startsWith('cache:')) {
          this._cache.push(value);
        }
      })
    });

    this.fileTransfer = this.transfer.create();
  }

  clearCache() {
    this.getCache()
      .forEach(sound => this.removeFromCache(sound));
  }

  /* Checks if sound with name already exists in cache */
  hasInCache(sound: any): boolean {
    return this.findWithAttr(this.getCache(), 'title', sound.title) > -1;
  };

  /* Adds new sound to cache and storage */
  addToCache(sound: any) {
    if (this.hasInCache(sound)) {
      return;
    }
    console.log(sound.file, this.file.cacheDirectory + sound.title);
    return this.fileTransfer.download(sound.file, this.file.cacheDirectory + sound.title)
      .then(entry => {
        sound.file = entry.toURL();
        sound.cacheDate = new Date();
        console.log(sound);
        this.storage.set('cache:' + sound.title, sound);
        this._cache.push(sound);
      })
      .catch(error => {
        console.log(error);
      })
  };

  /* Removes sound from cache and storage */
  removeFromCache(sound: any): void {
    let index = this.findWithAttr(this.getCache(), 'title', sound.title);
    if (index > -1) {
      this._cache.splice(index, 1);
      this.storage.remove('cache:' + sound.title);
      this.file.removeFile(this.file.cacheDirectory, sound.title);
    }
  };

  /* Adds to cache if it didn't exist yet, removes it otherwise */
  toggleInCache(sound: any): void {
    if (this.hasInCache(sound)) {
      this.removeFromCache(sound);
    } else {
      this.addToCache(sound);
    }
  }

  /* Returns entire cache */
  getCache() {
    return this._cache;
  }

  getFromCache(sound: any) {
    if (!this.hasInCache(sound)) {
      return null;
    }
    return this.getCache()[this.findWithAttr(this.getCache(), 'title', sound.title)]
  }

  /* Helper function to find elements in an array for which attr == value */
  findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
    return -1;
  }
}
