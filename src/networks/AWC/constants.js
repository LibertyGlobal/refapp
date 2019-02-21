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

const WINDOW_EVENTS = {
    CREATED: 'windowCreated',
    DESTROYED: 'windowDestroyed',
    RESIZED: 'windowResized',
};

const STATE_EVENTS = {
    RUNNING: 'stateRunning',
    STOPPED: 'stateStopped',
    SUSPENDED: 'stateSuspended',
    CONTENT_STOPPED: 'contentStopped',
    CRASHED: 'stateCrashed',
};

const AWC_INITIALIZED = 'awcInitialized';

const EMPTY_URL = 'about:blank';

const PROCESS_NAMES = {
    HIDDEN_SCREEN: 'hsapp',
    MAIN_UI: 'mainui',
    BROWSER: 'browser',
    SUBTITLES: 'subttxrend',
    NETFLIX: 'nfx',
};

const STATES = {
    RUNNING: 0,
    STOPPED: 1,
    SUSPENDED: 2,
    CONTENT_STOPPED: 3,
    CRASHED: 5,
};

const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Linux armv7l) AppleWebKit/602.1.28+ (KHTML, like Gecko) Version/9.1 Safari/601.5.17';
const DEVICE_TYPE = 'STB';

const FIXED_Z_ORDER = [
    PROCESS_NAMES.HIDDEN_SCREEN,
    PROCESS_NAMES.MAIN_UI,
    PROCESS_NAMES.BROWSER,
    PROCESS_NAMES.NETFLIX,
    PROCESS_NAMES.SUBTITLES,
];

const WINDOW_ACCESSOR_MAP = {
    SURFACE_ID: 0,
    PID: 1,
    IS_MAIN: 2,
    IS_VISIBLE: 3,
    WIDTH: 4,
    HEIGHT: 5,
};

const APPS_ACCESSOR_MAP = {
    REQUEST_ID: 0,
    RUN_ID: 1,
    PID: 2,
    STATE: 3,
};

const AWC_WINDOW_EVENTS = {
    0: 'CREATED',
    1: 'DESTROYED',
    2: 'RESIZED',
};

const AWC_STATE_CHANGE_EVENTS = {
    0: 'RUNNING',
    1: 'STOPPED',
    2: 'SUSPENDED',
    3: 'CONTENT_STOPPED',
    5: 'CRASHED',
};

module.exports = {
    WINDOW_EVENTS,
    STATE_EVENTS,
    AWC_INITIALIZED,
    EMPTY_URL,
    PROCESS_NAMES,
    STATES,
    DEFAULT_USER_AGENT,
    DEVICE_TYPE,
    WINDOW_ACCESSOR_MAP,
    APPS_ACCESSOR_MAP,
    AWC_WINDOW_EVENTS,
    AWC_STATE_CHANGE_EVENTS,
    FIXED_Z_ORDER,
};
