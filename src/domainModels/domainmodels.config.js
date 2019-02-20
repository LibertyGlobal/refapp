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

module.exports = {
    formatters: {
        channels(channelsData) {
            return channelsData;
        },
        epg(epgData) {
            return epgData;
        },
        apps(appsData) {
            return appsData;
        },
        ondemand(moviesData) {
            return moviesData;
        },
    },
    models: {
        channels: require('./channel'),
        epg: require('./epg'),
        apps: require('./apps'),
        ondemand: require('./ondemand'),
    },
};
