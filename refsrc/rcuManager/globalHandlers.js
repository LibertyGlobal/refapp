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

const { paths, go } = require('navigation');
const channelDomainModel = require('domainModels/channel');
const logger = require('shared/logger');

const { ChannelChangeTypes } = require('./constants');

const MODULE_NAME = 'rcuManager/globalHandlers';

function onBackToTv() {
    channelDomainModel.setCurrentChannel(channelDomainModel.getCurrentChannel())
        .then(() => go(paths.channelBar))
        .catch(err => logger.error(MODULE_NAME, 'onBackToTv', err));
}

function handlePlayoutKeys(key) {
    go(paths.player, key);
}

function onNumericInput({ keyCode, keyType }) {
    const channels = channelDomainModel.getChannels();

    go(paths.numericInput, {
        initialKeyCode: keyCode,
        onInputEnd: (chIndex) => {
            const channelToTune = channelDomainModel.getChannelOrNearestByLcn(channels, ~~chIndex);

            channelDomainModel.setCurrentChannel(channelToTune)
                .then(() => go(paths.channelBar))
                .catch(e => logger.error(MODULE_NAME, 'onNumericInput -> onIputEnd', e));
        },
    });
}

function onChannelChange(type = ChannelChangeTypes.CHDOWN) {
    const promise = type === ChannelChangeTypes.CHDOWN
        ? channelDomainModel.chDown()
        : channelDomainModel.chUp();

    promise.then(() => go('/channelBar'))
        .catch(e => logger.error(MODULE_NAME, 'onChannelChange', e));
}

module.exports = {
    onNumericInput,
    onChannelChange,
    onBackToTv,
    handlePlayoutKeys,
};
