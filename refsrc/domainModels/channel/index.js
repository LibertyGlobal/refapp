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

const service = require('./service');
const player = require('domainModels/player');
const logger = require('shared/logger');
const { ZapDirections } = require('./constants');
const { getChannelToZap, getChannelOrNearestByLcn } = require('./helpers');
const eventEmitter = require('shared/eventEmitter');
const { Events } = require('domainModels/system/constants');

const MODULE_NAME = 'domainModels/channel';

let channels;

let currentChannel;

function init(formatter) {
    return service.getChannels()
        .then(formatter)
        .then((data) => {
            channels = data.map((channel, index) => Object.assign({}, channel, { channelIndex: index + 1 }));
            const [firstChannel] = channels;
            currentChannel = firstChannel;
            return setCurrentChannel(currentChannel);
        })
        .catch(err => logger.error(MODULE_NAME, 'init', err));


}

function getCurrentChannel() {
    return currentChannel;
}

function getChannels() {
    return channels;
}

function setCurrentChannel(channel) {
    const playerPromise = ~channel.locator.indexOf('http') ? player.playIP(channel) : player.playQAM(channel);
    return playerPromise
        .then(() => {
            currentChannel = channel;
            logger.info(MODULE_NAME, 'hardZap', 'next channel is: ', channels.indexOf(currentChannel));
            eventEmitter.emit(Events.NEW_CHANNEL);
            return currentChannel;
        });
}

function hardZap(direction = ZapDirections.FORWARD) {
    return setCurrentChannel(getChannelToZap(direction, channels, currentChannel));
}

function chUp() {
    return hardZap(ZapDirections.FORWARD);
}

function chDown() {
    return hardZap(ZapDirections.BACKWARD);
}

module.exports = {
    init,
    getChannels,
    setCurrentChannel,
    chUp,
    chDown,
    getCurrentChannel,
    ZapDirections,
    getChannelToZap,
    getChannelOrNearestByLcn,
};
