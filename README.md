# LGI

## com.epam.lgi

## Table of contents

- [Getting started](#getting-started)
- [Running the App](#running-the-app)
- [Developing the App](#developing-the-app)
- [Components](#components)
  - [Background](#background)
  - [Channel Bar](#channel-bar)
  - [List](#list)
  - [Loading Indicator](#loading-indicator)
  - [Main Menu](#main-menu)
  - [Navbar](#navbar)
  - [PlayerProgress](#player-progress)
  - [Video](#video)
  - [WarningModal](#warning-modal)
- [Domain](#domain)
- [Lib](#lib)
- [Screens](#screens)
  - [Apps Screen](#apps-screen)
  - [Base Screen](#base-screen)
  - [Details Screen](#details-screen)
  - [Home Screen](#home-screen)
  - [MoviesScreen](#movies-screen)
  - [SettingsScreen](#settings-screen)
  - [SplashScreen](#splash-screen)
  - [VODScreen](#vod-screen)
- [Services](#services)
  - [Channels service](#channels-service)
  - [Player](#player)
- [Themes](#themes)
- [Additional](#additional)
  - [Animation](#animation)

### <a name="getting-started"></a>Getting started

> Before you follow the steps below, make sure you have the
[Lightning-CLI](https://github.com/WebPlatformForEmbedded/Lightning-CLI) installed _globally_ on your system

```
npm install -g WebPlatformForEmbedded/Lightning-CLI
```

### <a name="running-the-app"></a>Running the App

1. Install the NPM dependencies by running `npm install`

2. Build the App using the _Lightning-CLI_ by running `lng build` inside the root of your project

3. Fire up a local webserver and open the App in a browser by running `lng serve` inside the root of your project


### <a name="developing-the-app"></a>Developing the App

During development you can use the **watcher** functionality of the _Lightning-CLI_.

>TLDR; The most suitable case for functionality check is to use the `lng dev` command

- use `lng watch` to automatically _rebuild_ your App whenever you make a change in the `src` or  `static` folder
- use `lng dev` to start the watcher and run a local webserver / open the App in a browser _at the same time_

>**Windows users may experience issues with locking of the `dist` directory. In order to fix that issues please run `npm run cleanup` command**

You may consider to use [VSCode IDE](https://code.visualstudio.com/)since the project contains configuration presets for running and debugging of the app. This approach also helps to reduce the directory lock issue mentioned above.


### <a name="documentation"></a>Documentation

Use `lng docs` to open up the Lightning-SDK documentation. Also check out https://github.com/rdkcentral/Lightning-SDK for more detailed information about Lightning SDK.

### <a name="components"></a>Components

#### <a name="background"></a>Background
Background is a component that allows to quickly add a common bottom layer to any screen.

#### <a name="channel-bar"></a>Channel Bar
Channel bar is a component which provides you possibility to navigate among channels while you are watching some event and player is top view.
It also shows channel name and logo, start and end time of currently playing event on each channel.

#### <a name="list"></a>List
List is a component which provides ability to organize similar items as a grid structure. This component uses Lightning's mechanism to create a grid from items that developer provides.

#### <a name="loading-indicator"></a>Loading Indicator
Component is used for show during time-consuming operations (such as requests to server or processing big data packs).


#### <a name="main-menu"></a>Main Menu
Main Menu component is used for navigating among main 'big' components  like [AppsScreen](#apps-screen), [MoviesScreen](#movies-screen) and so on.

#### <a name="navbar"></a>Navbar
Navbar component is a container for all navigation bar components (background, bottom line, menu) and used for setting and updating of Menu items

#### <a name="player-progress"></a>PlayerProgress

PlayerProgress component shows title, progress and current time of the video which is currently playing.

#### <a name="video"></a>Video

Video component extends MediaPlayer component to fix positioning of the video

#### <a name="warning-modal"></a>WarningModal

WarningModal is a component which can be used for different purposes from showing errors to showing some information about system and other things.

### <a name="domain"></a>Domain
Used for store domain properties. It can be used for switch to custom domains if needs.

### <a name="lib"></a>Lib
Here is navigation functional. Navigation module is used for showing specific components in proper order.
Router component is used for that. Router is configured from RoutingMap. Developer can describe desired behaviour using methods `navigate(urlFromRoutingMap)` for navigate to specified url, `navigateForward()` and `navigateBackward()` for navigate through screens stack.

Example:

```javascript
setupRouter(app, document.location.hash)

navigate('home')
navigateForward()
navigateBackward()
```

### <a name="screens"></a>Screens

#### <a name="apps-screen"></a>AppsScreen
Apps components is a collection of different applications and services that are integrated in our application.

#### <a name="base-screen"></a>BaseScreen

#### <a name="details-screen"></a>DetailsScreen
Detail page component is used for showing information about movies in [VODScreen](#vod-screen).

#### <a name="home-screen"></a>HomeScreen
Screen which is used as initial screen after loading. Contains video player and channel bar.

#### <a name="movies-screen"></a>MoviesScreen

Movies screen is a collection of movies. It has Recommended section which shows you assets based on what you have seen recently, and section with all movies.

#### <a name="settings-screen"></a>SettingsScreen

Settings screen is used for displaying some app settings.

#### <a name="splash-screen"></a>SplashScreen

Splash screen shows loading animation while app is launching.

#### <a name="vod-screen"></a>VODScreen

VOD screen is used for playback of selected movie and updating of progress bar.

### <a name="services"></a>Services
#### <a name="channels-service"></a>Channels Service
Service is used for getting and parsing list of channels and programs.

#### <a name="player"></a>Player
Provide players and common interface to use them.
Initialization
Example:

```javascript
import { init as initPlayers } from './services/player'

initPlayers({
  ipPlayerMode: 'sessionManager',
  endpoint: // here has to be your raspberry ip like this 'http://192.168.1.102:8080'
})
```
Then you can use it

```javascript
import * as player  from '@/services/player/'
//entry has to contain field locator, it would be video resource ip you want to play
// entry = {
//   locator: "ip_of_resource"
// }
await player.playIP(entry)
```
Start/Pause player

```javascript
player.play()
player.pause()
```
To get metadata of current video, use
```javascript
player.getPlaybackState() // returns promise with current position, duration and other
```

### <a name="themes"></a>Themes
Can be used for quick customization of application. Just describe new theme and set it as active.

### <a name="additional"></a>Additional
#### <a name="animation"></a>Animation

Here is used Lightning animations. More information can be found in Lightning manual.
Example:

```javascript
anim = this.animation({
  duration: durationInSeconds, repeat: repeatCount, actions:[{t: animatedObjectName, p:propertyToAnimate, v:{0: startValue, 1: finishValue}}]
})

anim.start()
anim.stop()
```
