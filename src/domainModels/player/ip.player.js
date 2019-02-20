/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Operator reference application
 *
 * Copyright (C) 2018-2019 Liberty Global B.V.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; version 2 of the License.
 */

'use strict';

const logger = require('shared/logger');

const { playerModes } = require('./constants');
const sessionManager = require('./strategies/sessionManager');
const rdkPlayerManager = require('./strategies/rdkPlayerManager');

const MODULE_NAME = 'domainModels/player/ip.player';

let currentPlayableEntity;
let mode = playerModes.SSM;

function getCurrentPlayableEntity() {
    return currentPlayableEntity;
}

function playIP(vod) {
    currentPlayableEntity = vod;
    if (isRdkMode()) {
        return rdkPlayerManager.startIP(vod.locator);
    }
    const config = {
        type: 'main',
        locator: vod.locator,
        refId: vod.refId,
    };

    return sessionManager.startPlayback(config);
}

function pause() {
    if (isRdkMode()) {
        return rdkPlayerManager.pause();
    }
    return sessionManager.setPlaybackState({ speed: 0 });
}

function play() {
    if (isRdkMode()) {
        return rdkPlayerManager.play();
    }
    return sessionManager.setPlaybackState({ speed: 1 });
}

function jump(position) {
    if (isRdkMode()) {
        return rdkPlayerManager.setPosition(position);
    }
    return sessionManager.setPlaybackState({ position });
}

function isRdkMode() {
    return mode === playerModes.RDK;
}

function getPlaybackState() {
    return isRdkMode() ? rdkPlayerManager.getPlaybackState() : sessionManager.getPlaybackState();
}

function stop() {
    if (isRdkMode()) {
        return rdkPlayerManager.stopIP();
    }
    return sessionManager.stopCurrentPlayback();
}

function setUpPlayer({ ipPlayerMode, endpoint }) {
    logger.log(MODULE_NAME, 'use mode for ip player', ipPlayerMode);

    mode = ipPlayerMode;
    if (isRdkMode()) {
        return rdkPlayerManager.initPlayer();
    }

    sessionManager.setPlayerEndpoint(endpoint);
    return Promise.resolve();
}

module.exports = {
    getCurrentPlayableEntity,
    getPlaybackState,
    playIP,
    stop,
    pause,
    play,
    jump,
    setUpPlayer,
};
