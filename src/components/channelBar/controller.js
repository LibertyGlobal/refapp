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
const channelDomainModel = require('domainModels/channel');
const epgDomainModel = require('domainModels/epg');
const { Keys, KeyPressTypes } = require('shared/constants');
const navigator = require('navigation');
const { isNumber } = require('shared/helpers');
const { delay, nop, debounce } = require('shared/utils');

const view = require('./view');
const { model, updateModel } = require('./model');
const { HIDE_TIMEOUT, NUMERIC_ZAPPING_TIMEOUT, ZapTypes } = require('./constants');

const MODULE_NAME = 'componenets/channelBar/controller';

let channels;
let currentChannel;
const debouncedBack = debounce(navigator.back, HIDE_TIMEOUT);

function applyUpdates(data) {
    updateModel(data);
    model.updateView();
    debouncedBack();
}

function softZap(direction = channelDomainModel.ZapDirections.FORWARD) {
    const channel = model.get('channel');
    currentChannel = channelDomainModel.getChannelToZap(direction, channels, channel);
}

function getChannelBarData(zapType = ZapTypes.HARD) {
    const channel = zapType === ZapTypes.HARD
        ? channelDomainModel.getCurrentChannel()
        : currentChannel;

    const currentEvent = epgDomainModel.getCurrentEventForChannel(channel.channelId);

    return {
        channel,
        currentEvent,
    };
}

function onEnter() {
    const softZappedChannel = model.get('channel');
    const tunnedChannel = channelDomainModel.getCurrentChannel();

    if (softZappedChannel.channelId !== tunnedChannel.channelId) {
        channelDomainModel.setCurrentChannel(softZappedChannel)
            .then(() => applyUpdates(getChannelBarData()))
            .catch(e => logger.error(MODULE_NAME, 'onEnter', e));
    }
}


function numericZappingHandler(chIndex) {
    const channelToTune = channelDomainModel.getChannelOrNearestByLcn(channels, ~~chIndex);
    const tunnedChannel = channelDomainModel.getCurrentChannel();

    if (channelToTune.channelId === tunnedChannel.channelId) {
        delay(NUMERIC_ZAPPING_TIMEOUT)
            .then(navigator.back)
            .catch(nop);
    } else {
        channelDomainModel.setCurrentChannel(channelToTune)
            .then(() => delay(NUMERIC_ZAPPING_TIMEOUT))
            .then(() => {
                navigator.back();
                applyUpdates(getChannelBarData());
            })
            .catch(e => logger.error(MODULE_NAME, 'onIputEnd', e));
    }
}

const keysToHandle = new Set([Keys.Up, Keys.Down]);

function downAndRepeatHandler({ keyCode, keyType }) {

    if (keyType === KeyPressTypes.keyUp || !keysToHandle.has(keyCode)) {
        return false;
    }

    switch (keyCode) {
        case Keys.Up:
            softZap(channelDomainModel.ZapDirections.BACKWARD);
            applyUpdates(getChannelBarData(ZapTypes.SOFT));
            return true;
        case Keys.Down:
            softZap(channelDomainModel.ZapDirections.FORWARD);
            applyUpdates(getChannelBarData(ZapTypes.SOFT));
            return true;
        default:
            return false;
    }
}


function downHandler({ keyCode, keyType }) {
    let used = false;

    if (isNumber(keyCode)) {
        navigator.go(navigator.paths.numericInput, {
            initialKeyCode: keyCode,
            onInputEnd: numericZappingHandler,
        });
        used = true;
        return used;
    }

    switch (keyCode) {
        case Keys.ChDown:
            channelDomainModel.chDown()
                .then(() => applyUpdates(getChannelBarData()))
                .catch(e => logger.error(MODULE_NAME, 'chDown', e));
            used = true;
            break;
        case Keys.ChUp:
            channelDomainModel.chUp()
                .then(() => applyUpdates(getChannelBarData()))
                .catch(e => logger.error(MODULE_NAME, 'chDown', e));
            used = true;
            break;
        case Keys.Enter:
            onEnter();
            used = true;
            break;
        default:
    }

    return used;
}


function onKey({ keyCode, keyType }) {
    let used = false;

    used = downAndRepeatHandler({ keyCode, keyType });

    if (keyType !== KeyPressTypes.keyDown || used) {
        return used;
    }

    return downHandler({ keyCode, keyType });
}

function show() {
    logger.log(MODULE_NAME, 'show');
    channels = channelDomainModel.getChannels();
    updateModel(getChannelBarData());
    view.render(model);
    debouncedBack();
}

function hide() {
    debouncedBack.cancel();
    view.clean();
}

module.exports = {
    show,
    hide,
    onKey,
    NUMERIC_ZAPPING_TIMEOUT,
    name: 'Channel bar',
};
