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

const player = require('domainModels/player');
const logger = require('shared/logger');
const navigator = require('navigation');
const channelDomainModel = require('domainModels/channel');
const epgDomainModel = require('domainModels/epg');
const { getNow } = require('domainModels/system');
const { debounce, secondsToMilliseconds } = require('shared/utils');
const { Keys, KeyPressTypes } = require('shared/constants');

const view = require('./view');
const { model, updatePlaybackState, updateVisibility } = require('./model');
const { isPlayoutEnded } = require('./helpers');
const {
    JumpDirections,
    PlayoutModes,
    JUMP_OFFSET,
    PLAYER_HIDE_TIMEOUT,
    PLAYER_UPDATE_INTERVAL,
} = require('./constants');

const MODULE_NAME = 'components/player/controller';

let intervalId;
let mode = PlayoutModes.LIVE_CHANNEL;

function hideViewWithoutClose() {
    updateVisibility(false);
}

const hideDebounced = debounce(hideViewWithoutClose, PLAYER_HIDE_TIMEOUT);

function handleEndOfPlayout() {
    if (mode === PlayoutModes.VOD) {
        channelDomainModel.setCurrentChannel(channelDomainModel.getCurrentChannel())
            .then(navigator.go(navigator.paths.channelBar))
            .catch(err => logger.error(MODULE_NAME, 'handleEndOfPlayout', err));
    } else {
        hideDebounced.cancel();
        navigator.go(navigator.paths.player);
    }
}

function updatePlayer(playbackState) {
    logger.info(MODULE_NAME, 'updatePlayer', 'playbackState is: ', playbackState);
    const { position, duration } = playbackState;

    isPlayoutEnded(duration, position) && duration !== 0 && handleEndOfPlayout();
    updatePlaybackState(playbackState);
    model.updateView();
}

function setupUpdateForChannel({ duration, endTime }) {

    function onTick() {
        const now = secondsToMilliseconds(getNow());
        updatePlayer({
            duration,
            position: duration - (endTime - now),
        });

        return Promise.resolve();
    }

    clearInterval(intervalId);
    intervalId = setInterval(onTick, PLAYER_UPDATE_INTERVAL);

    return onTick();
}

function setupUpdateForVod() {

    function onTick() {
        return player.getPlaybackState()
            .then(updatePlayer)
            .catch(err => logger.error(MODULE_NAME, 'getPlaybackState', err));
    }

    clearInterval(intervalId);
    intervalId = setInterval(onTick, PLAYER_UPDATE_INTERVAL);

    return onTick();
}

function handleJump(direction) {
    const { position, duration } = model;
    const newPosition = direction === JumpDirections.FORWARD
        ? position + JUMP_OFFSET : Math.max(0, position - JUMP_OFFSET);

    if (duration <= newPosition) {
        handleEndOfPlayout();
    } else {
        player.jump(newPosition);
    }
}

function handlePlayPause() {
    const { speed } = model;
    speed === 0 ? player.play() : player.pause();
}

function onKey({ keyCode, keyType }) {
    let used = false;

    if (keyType !== KeyPressTypes.keyDown) {
        return used;
    }

    updateVisibility(true);
    model.updateView();

    switch (keyCode) {
        case Keys.Back:
        case Keys.BackToTV:
            channelDomainModel.setCurrentChannel(channelDomainModel.getCurrentChannel())
                .then(() => navigator.go(navigator.paths.channelBar))
                .catch(err => logger.error(MODULE_NAME, 'handleEndOfPlayout', err));
            used = true;
            break;
        case Keys.Menu:
            channelDomainModel.setCurrentChannel(channelDomainModel.getCurrentChannel())
                .then(() => navigator.go(navigator.paths.mainMenu))
                .catch(err => logger.error(MODULE_NAME, 'handleEndOfPlayout', err));
            used = true;
            break;
        case Keys.Left:
            handleJump(JumpDirections.BACKWARD);
            used = true;
            break;
        case Keys.Right:
            handleJump(JumpDirections.FORWARD);
            used = true;
            break;
        case Keys.Enter:
        case Keys.PlayPause:
            handlePlayPause();
            used = true;
            break;
        case Keys.Stop:
            player.stopPlayBack();
            used = true;
            break;
        default:
            used = true;
    }

    hideDebounced();

    return used;
}

function startChannelMode(channel) {
    const { startTime, endTime, title } = epgDomainModel.getCurrentEventForChannel(channel.channelId);

    model.title = title;

    const startTimeMs = secondsToMilliseconds(startTime);
    const endTimeMs = secondsToMilliseconds(endTime);
    const duration = endTimeMs - startTimeMs;

    return setupUpdateForChannel({ duration, endTime: endTimeMs });
}

function startVodMode(entity, initialKey) {
    model.title = entity.title;
    return setupUpdateForVod();
}

function show(initialKey) {
    const entity = player.getCurrentPlayableEntity();
    mode = entity.channelId ? PlayoutModes.LIVE_CHANNEL : PlayoutModes.VOD;

    const modePromise = entity.channelId
        ? startChannelMode(entity) : startVodMode(entity);

    modePromise
        .then(() => onKey(initialKey))
        .catch(err => logger.error(MODULE_NAME, 'show', err));

    view.render(model);

    hideDebounced();
}

function hide() {
    clearInterval(intervalId);
    view.clear();
}

module.exports = {
    name: 'Player',
    show,
    hide,
    onKey,
};
