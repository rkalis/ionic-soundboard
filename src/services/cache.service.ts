import { Injectable } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Injectable()
export class CacheService {
  _cache: any[] = [];
  _ready: Promise<any>;
  maxCachedDays = 7;
  fileTransfer: FileTransferObject;

  constructor(
    private storage: Storage,
    private transfer: FileTransfer,
    private file: File,
    private platform: Platform
  ) {
    /* When storage is ready, load cache into memory
     * After loading the cache into the memory, this service is ready
     */
    this._ready = new Promise((resolve, reject) => {
      this.platform.ready()
      .then(() => {
        this.fileTransfer = this.transfer.create();
        return this.storage.ready()
        .then(() => {
          return this.storage.forEach((value: any, key: string) => {
            if (key.startsWith('cache:')) {
              this.getCache().push(value);
              /* If the sound is outdated, remove it */
              if (this.isOutdated(value)) {
                this.removeFromCache(value)
                .catch(error => reject(error));
              }
            }
          });
        });
      })
      .then(() => resolve())
      .catch(error => reject(error));
    });
  }

  ready(): Promise<any> {
    return this._ready;
  }

  clearCache(): Promise<any> {
    return new Promise((resolve, reject) => {
      /* Loops through the entire cache and remove all entries by
       * calling this.removeFromCache for each of them.
       * This loop is back to front because there would be
       * async issues when looping front to back
       */
      for (let i = this.getCache().length - 1; i >= 0; i--) {
        const sound = this.getCache()[i];
        this.removeFromCache(sound)
        .then(() => {
          /* Resolve when all sounds have been removed */
          if (this.getCache().length === 0) {
            return resolve();
          }
        })
        .catch(error => reject(error));
      }
      /* Also resolve if cache already was empty */
      return resolve();
    });
  }

  /* Checks if sound with the same name already exists in cache */
  hasInCache(sound: any): boolean {
    return this.getCache().findIndex(cachedSound => cachedSound.title === sound.title) > -1;
  }

  /* Downloads a file into the local data directory, adding the sound object
   * to the cache storage as well.
   */
  addToCache(sound: any): Promise<any> {
    return new Promise((resolve, reject) => {
      /* Resolve with existing sound if it is already present and not outdated,
       * set src property to the remote one if it is outdated, so it will get
       * replaced
       */
      if (this.hasInCache(sound)) {
        if (!this.isOutdated(sound)) {
          return resolve(this.getFromCache(sound));
        }
        if (sound.remoteSrc) {
          sound.src = sound.remoteSrc;
        }
      }

      /* Download file at sound.src into the local data directory */
      this.fileTransfer.download(sound.src, this.file.dataDirectory + sound.title)
      .then(entry => {
        /* Media plugin can't play sounds with 'file://' prefix on ios */
        let src = entry.toURL();
        if (this.platform.is('ios')) {
          src = src.replace(/^file:\/\//, '');
        }

        const cachedSound = {
          title: sound.title,
          src: src,
          remoteSrc: sound.src,
          cacheDate: new Date()
        };

        return this.storage.set('cache:' + cachedSound.title, cachedSound)
        .then(() => {
          this.getCache().push(cachedSound);
          return resolve(cachedSound);
        });
      })
      .catch(error => reject(error));
    });
  }

  /* Removes sound from local data directory and cache storage */
  removeFromCache(sound: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const index = this.getCache().findIndex(cachedSound => cachedSound.title === sound.title);
      if (index === -1) {
        return reject('Not in cache');
      }

      /* Remove the sound from memory */
      this.getCache().splice(index, 1);

      /* Remove the sound from cache storage */
      this.storage.remove('cache:' + sound.title)
      .catch(error => reject(error));

      /* Remove the sound from filesystem */
      return this.file.removeFile(this.file.dataDirectory, sound.title);
    });
  }

  /* Checks if a cached sound needs to be refreshed */
  isOutdated(sound: any): boolean {
    return this.hasInCache(sound) && new Date().getDate() - this.maxCachedDays > this.getFromCache(sound).cacheDate.getDate();
  }

  /* Returns entire cache */
  getCache(): any[] {
    return this._cache;
  }

  /* Returns a cached sound from cache */
  getFromCache(sound: any): any {
    if (!this.hasInCache(sound)) {
      return null;
    }
    return this.getCache()[this.getCache().findIndex(cachedSound => cachedSound.title === sound.title)];
  }
}
