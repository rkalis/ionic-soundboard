# Ionic 3 Soundboard

This app takes a collection of sounds from a custom URL. That way sounds can be added and removed at will, while still keeping the app code the same. The app makes use of [Ionic 3](https://ionicframework.com/) with [TypeScript](https://www.typescriptlang.org/).

Note: Some of the Ionic Native features (such as caching) add quite a bit of complexity to the code. For a more simple version of the app without these native features you can check out [the 'simple' branch](https://github.com/rkalis/ionic-soundboard/tree/simple).

## Prerequisities
Assumes that Homebrew is installed.
For alternative installation options for Node, refer to their [website](https://nodejs.org/)
```
brew install node
npm install -g cordova
npm install -g ionic
```

## Setup
Assumes that Git is installed along with the prerequisites.
```
git clone git@github.com:rkalis/ionic-soundboard.git
cd ionic-soundboard
npm install
```
Then run it locally with any of the following
```
ionic serve --lab
ionic cordova run ios
ionic cordova run android
```
The first one running it in the browser, while the others run on a device or emulator. Note that Ionic Native features (such as caching) are disabled in the browser.

## Features
The app is a simple soundboard, with a list of sounds, which can be played, and stopped when they are playing. In the soundboard, you have the option to mark certain sounds as favourites, moving them to the top of the list. This way, you can have all your favourite sounds right there at your fingertips. When running on a native platform (iOS, Android, etc.), every sound is cached for seven days when playing it. That way the sounds can still be accessed when there is no internet connection. Local caching can be enabled or disabled, and the cache can be cleared in the preferences menu.

<img src="https://i.imgur.com/bMLQCSe.png" width="500">

## Customising
### Title & Default Preferences
Open `ionic-soundboard/src/pages/soundboard/soundboard.ts` to edit the `title` variable.

Open `ionic-soundboard/src/services/preferences.service.ts` to edit the default preferences:
```javascript
get DEFAULT_PREFERENCES() {
  return {
    baseUrl: 'http://kalis.me',
    soundsFile: '/sounds.json',
    cachingEnabled: true
  };
}
```
Edit the default values to point to your own base url and your own sounds file.

### Icon & Splash Screen
Replace `ionic-soundboard/resources/icon.png` and `ionic-soundboard/resources/splash.png` with your own files.
Then run:
```
ionic cordova resources ios
ionic cordova resources android
```

## Usage

There should be a file at  the path specified by `preferenceService.get('baseUrl')` + `preferenceService.get('soundsFile')` containing a json array with objects in the following format:
```javascript
{
    "title": "Sample Title",
    "file": "/sample_sound.mp3"
}
```

For example http://misc.kalis.me/sounds.json looks like this:
```javascript
[
    {
        "title": "Bird",
        "file": "/res/bird.mp3"
    },
    {
        "title": "Cat",
        "file": "/res/cat.mp3"
    },
    {
        "title": "Cow",
        "file": "/res/cow.mp3"
    },
    {
        "title": "Dog",
        "file": "/res/dog.mp3"
    },
    {
        "title": "Dolphin",
        "file": "/res/dolphin.mp3"
    },
    {
        "title": "Frog",
        "file": "/res/frog.mp3"
    },
    {
        "title": "Pig",
        "file": "/res/pig.mp3"
    }
]

```
Resulting in this soundboard:
![Soundboard](https://i.imgur.com/utd8KZU.png)

## Testing/Building/Publishing
Please refer to the [ContactApp Wiki](https://github.com/incodehq/contactapp/wiki)
for a comprehensive guide to testing, building, and publishing Ionic apps. Do note that the ContactApp was written in an older version of Ionic.
