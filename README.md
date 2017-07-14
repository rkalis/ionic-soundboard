# Ionic 3 Soundboard

This app takes a collection of sounds from a custom URL.
That way sounds can be added and removed at will,
while still keeping the app code the same.
The app makes use of [Ionic 3](https://ionicframework.com/) with [TypeScript](https://www.typescriptlang.org/).

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
ionic platform add ios
ionic platform add android
```
Then run it locally with
```
ionic serve --lab
```

## Features
The app is a simple soundboard, with a list of sounds, which can be played, and stopped when they are playing. In the soundboard, you have the option to mark certain sounds as favourites, moving them to the top of the list. This way, you can have all your favourite sounds right there at your fingertips.

<img src="https://i.imgur.com/cZjbwtG.png" width="240">

## Customising
### Text
Open `ionic-soundboard/src/pages/soundboard/soundboard.ts` and edit the following variables:
* base_url -> The website which hosts your sound files
* sounds_url -> The location where your sounds are on your website
* title -> The title shown in the top bar of the app

### Icon & Splash Screen (Note: this Ionic feature is in Beta)
Replace `ionic-soundboard/resources/icon.png` and `ionic-soundboard/resources/splash.png` with your own files.
Then run:
```
ionic cordova resources ios
ionic cordova resources android
```

## Usage

On the web address specified by base_url + sounds_url there should be a page containing link tags in the following format:
```
<a href="sample_sound.mp3">Sample Title</a>
```

For example http://kalis.me/sounds looks like this:
```
<a href="/res/bird.mp3">Bird</a>
<a href="/res/cat.mp3">Cat</a>
<a href="/res/cow.mp3">Cow</a>
<a href="/res/dog.mp3">Dog</a>
<a href="/res/dolphin.mp3">Dolphin</a>
<a href="/res/frog.mp3">Frog</a>
<a href="/res/pig.mp3">Pig</a>
```
Resulting in this soundboard:
![Soundboard](https://i.imgur.com/TeVbQFR.png)

## Testing/Building/Publishing
Please refer to the [ContactApp Wiki](https://github.com/incodehq/contactapp/wiki)
for a comprehensive guide to testing, building, and publishing Ionic apps.
