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

const { model, setOpenedViewTitle, setTime } = require('./model');
const { getNow, eventEmitter, setSystemInterval, clearSystemInterval } = require('domainModels/system');
const { Events } = require('domainModels/system/constants');
const { secondsToMilliseconds } = require('shared/utils');
const { getTopComponent } = require('navigation');
const channelDomainModel = require('domainModels/channel');
const epgDomainModel = require('domainModels/epg');
const view = require('./view');
const logger = require('shared/logger');

const MODULE_NAME = 'header/controller';

let timer;

function show(params) {
    const channel = channelDomainModel.getCurrentChannel();
    const currentEvent = epgDomainModel.getCurrentEventForChannel(channel.channelId);
    const delay = secondsToMilliseconds(currentEvent.endTime - getNow());
    timer = setTimeout(updateEventTitle, delay);

    setOpenedViewTitle(getTopComponent().name);
    setTime(secondsToMilliseconds(getNow()));

    setSystemInterval(60, updateTime, false);

    view.render(model);
}

function updateEventTitle() {
    clearTimeout(timer);
    const channel = channelDomainModel.getCurrentChannel();
    const currentEvent = epgDomainModel.getCurrentEventForChannel(channel.channelId);
    const delay = secondsToMilliseconds(currentEvent.endTime - getNow());
    model.updateView();
    timer = setTimeout(updateEventTitle, delay);
}

function updateTime(currentTime) {
    setTime(secondsToMilliseconds(currentTime));
    model.updateView();
}

function hide() {
    clearSystemInterval(updateTime);
    clearTimeout(timer);
    view.clean();
}

function onKey({ keyType, keyCode }) {
    logger.info(MODULE_NAME, 'onKey');
    return false;
}

module.exports = {
    show,
    hide,
    onKey,
};
