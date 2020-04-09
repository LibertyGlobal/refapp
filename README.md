# Operator reference application

The [operator reference appliation](https://github.com/LibertyGlobal/refapp) provides a basic GUI that allows for playback of QAM and IP video and startup of various types of applications in the [RDK](https://wiki.rdkcentral.com/display/RDK/RDK+Central+Wiki) environment. It is a Lighting js application that runs in the broswer. For control of QAM, IP and applications the refapp uses the api offered by the RDK components sessionmanager, aamp and optimus.

Setting up your environment:
Start by installing the Lightning-CLI (Command-line interface) npm install -g WebPlatformForEmbedded/Lightning-CLI

Build and run commands:
cd refapp/
lng build 
lng serve

## Table of contents

- [Getting started](#getting-started)
- [Refapp breakdown](#refapp-breakdown)
	- [Components](#components)
	    - [Apps](#apps)
		- [Main Menu](#main-menu)

## <a name="refapp-breakdown"></a>Refapp breakdown


### <a name="components"></a>Components

#### <a name="apps"></a>Apps
Apps components is a collection of different applications and services that are integrated in our application.

#### <a name="main-menu"></a>Main Menu
Main Menu component is used for navigating among main 'big' components  like [Apps](#apps), [Movie](#ondemand), [#setting]].

This application under developing stage. 

