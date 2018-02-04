import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SoundboardApp } from './app.component';

import { SoundboardPage } from '../pages/soundboard/soundboard';
import { PreferencesPage } from '../pages/preferences/preferences';

import { CacheService } from '../services/cache.service';
import { FavouritesService } from '../services/favourites.service';
import { MediaService } from '../services/media.service';
import { PreferencesService } from '../services/preferences.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Media } from '@ionic-native/media';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

@NgModule({
  declarations: [
    PreferencesPage,
    SoundboardApp,
    SoundboardPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(SoundboardApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    SoundboardApp,
    PreferencesPage,
    SoundboardPage
  ],
  providers: [
    CacheService,
    FavouritesService,
    MediaService,
    PreferencesService,
    File,
    FileTransfer,
    Media,
    SplashScreen,
    StatusBar,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
