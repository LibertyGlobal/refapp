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

const { SCREEN_SIZE } = require('shared/constants');

const DEFAULT_URL = 'https://tv.youtube.com/';

const INITIAL_APP_ID = 2000;

const DEFAULT_APP_PROPS = {
    id: INITIAL_APP_ID,
    priority: 1,
    x: 0,
    y: 0,
    w: SCREEN_SIZE.width,
    h: SCREEN_SIZE.height,
    cx: 0,
    cy: 0,
    sx: 1.0,
    sy: 1.0,
    r: 0,
    a: 1,
    interactive: true,
    painting: true,
    clip: false,
    mask: false,
    draw: true,
    launchParams: { cmd: 'wpe', uri: DEFAULT_URL },
};

const events = {
    OPTIMUS_INITIALIZED: 'optimus_initialized',
};

const appTypesMap = {
    html5: 'WebApp',
    spark: 'spark',
    native: 'native',
    dac: 'dac',
};

const appStatuses = {
    SUSPENDED: 'SUSPENDED',
    RUNNING: 'RUNNING',
};

module.exports = {
    DEFAULT_APP_PROPS,
    events,
    appTypesMap,
    INITIAL_APP_ID,
    appStatuses,
};
