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

const config = require(process.env.CONFIG);

require('rcuManager');

const { init: initNavigator, go, paths } = require('navigation');
const { init: initPlayers } = require('domainModels/player');
const { init: initOnPreKey } = require('rcuManager/onPreKey');
const domainModelsConfig = require('domainModels/domainmodels.config.js');
const logger = require('shared/logger');
const { appWindowControllerKeys } = require('shared/constants');
const appManager = require('appManager');
const comcast = require('networks/comcast');

appManager.injectAppsWindowController(appWindowControllerKeys.COMCAST_AM, comcast);

try {
    require('keyEmitters/dbus');
} catch (e) {
    logger.warn('boot', 'init dbus', `${e}`);
}

require('keyEmitters/keyboard');

function initDataForDomainModels() {
    const { models, formatters } = domainModelsConfig;
    return Promise.all(Object.keys(models)
        .map(key => models[key].init(formatters[key])));
}

Promise.all([
    initDataForDomainModels(),
    appManager.init(),
    initNavigator(),
    initPlayers(config),
    initOnPreKey(),
]).then(() => {
    go(paths.mainMenu);
}).catch(err => logger.error('boot.js', 'initDomainModels', err));

