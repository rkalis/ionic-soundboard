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
* sounds_file -> The json file containing links to your sound files
* title -> The title shown in the top bar of the app

### Icon & Splash Screen (Note: this Ionic feature is in Beta)
Replace `ionic-soundboard/resources/icon.png` and `ionic-soundboard/resources/splash.png` with your own files.
Then run:
```
ionic cordova resources ios
ionic cordova resources android
```

## Usage

There should be a file at  the path specified by base_url + sounds_file containing a json array with objects in the following format:
```
{
    "title": "Sample Title",
    "file": "/sample_sound.mp3"
}
```

For example http://kalis.me/sounds.json looks like this:
```
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
![Soundboard](https://i.imgur.com/TeVbQFR.png)

## Testing/Building/Publishing
Please refer to the [ContactApp Wiki](https://github.com/incodehq/contactapp/wiki)
for a comprehensive guide to testing, building, and publishing Ionic apps.
