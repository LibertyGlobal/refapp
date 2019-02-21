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
const { getNow } = require('domainModels/system');

let epgData;

function init(formatter) {
    return service.getEpgEvents()
        .then(formatter)
        .then((data) => {
            epgData = data;
        })
        .catch();
}

function getEventsForChannel(channelId) {
    const data = epgData.find(data => data.channelId === channelId);

    return data ? data.events : null;
}

function getCurrentEventForChannel(channelId) {
    const events = getEventsForChannel(channelId);
    const now = getNow();

    return events.find((e) => {
        return e.startTime <= now && e.endTime > now;
    });
}

function getEpgData() {
    return epgData;
}

module.exports = {
    getCurrentEventForChannel,
    getEpgData,
    init,
};
