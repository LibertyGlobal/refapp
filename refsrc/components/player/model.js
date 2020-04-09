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

const ViewModel = require('shared/ViewModel');
const { StyleConstants } = require('./constants');

const model = new ViewModel();

model.set('currentTimeProgress', '00:00');
model.set('playerProgressBarWidth', 0);
model.set('trickPlayIconPosition', StyleConstants.TRICKPLAY_ICON_LEFT);
model.set('visibility', true);

function formatTimeString(position) {
    const minutes = Math.floor(position / 1000 / 60);
    const seconds = Math.floor((position - (minutes * 1000 * 60)) / 1000);

    const formattedMinutes = String(minutes).length > 1 ? minutes : `0${minutes}`;
    const formattedSeconds = String(seconds).length === 2 ? seconds : `0${seconds}`;

    return `${formattedMinutes}:${formattedSeconds}`;
}

function calculateProgressBarWidth(duration, position) {
    const progress = position / duration;

    return Math.round(progress * StyleConstants.PLAYER_PROGRESS_BAR_WIDTH);
}

function updatePlaybackState({ position, duration, speed }) {
    const timeProgressString = formatTimeString(position);
    const progressBarWidth = calculateProgressBarWidth(duration, position) || 1;
    const trickPlayIconPosition = StyleConstants.TRICKPLAY_ICON_LEFT + progressBarWidth;

    model.speed = speed;
    model.position = position;
    model.duration = duration;
    model.set('currentTimeProgress', timeProgressString);
    model.set('progressBarWidth', progressBarWidth);
    model.set('trickPlayIconPosition', trickPlayIconPosition);
}

function updateVisibility(visibility) {
    model.set('visibility', visibility);
}

module.exports = { model, updatePlaybackState, updateVisibility };
