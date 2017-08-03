import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

if (window['cordova']) {
  document.addEventListener('deviceready', () => platformBrowserDynamic().bootstrapModule(AppModule));
} else {
  platformBrowserDynamic().bootstrapModule(AppModule);
}
