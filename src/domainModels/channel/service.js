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

const fs = require('fs');
const path = require('path');

const DEFAULT_CACHE_ENV = 'demo';

function getCachePath(cacheEnv) {
    return path.resolve(__dirname, path.join('../../cache', cacheEnv, 'channelsV2.json'));
}

function getChannels() {
    const cacheEnv = process.env.CHANNELS_CACHE_ENV || DEFAULT_CACHE_ENV;
    const cachePath = getCachePath(cacheEnv);

    if (fs.existsSync(cachePath)) {
        return Promise.resolve(require(cachePath));
    }

    return Promise.resolve(require(getCachePath(DEFAULT_CACHE_ENV)));
}

module.exports = {
    getChannels,
};
