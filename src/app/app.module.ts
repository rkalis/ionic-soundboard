import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';

import { SoundboardPage } from '../pages/soundboard/soundboard';

import { CacheService } from '../providers/cache.service';
import { FavouritesData } from '../providers/favouritesdata';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Media } from '@ionic-native/media';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

@NgModule({
  declarations: [
    MyApp,
    SoundboardPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SoundboardPage
  ],
  providers: [
    CacheService,
    FavouritesData,
    File,
    FileTransfer,
    Media,
    SplashScreen,
    StatusBar,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
