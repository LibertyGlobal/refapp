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

const AWC = require('./AWC.network');
const htmlAppController = require('./htmlApp.controller.js');
const { DEFAULT_USER_AGENT } = require('./constants');
const logger = require('shared/logger');

const moduleName = 'AWC';

const controllersMap = {
    html5: htmlAppController,
};

function makeActualAppSetting(app) {
    return {
        url: app.url,
        userAgent: DEFAULT_USER_AGENT,
    };
}

let actualAppController;
let isAppOpened = false;

module.exports = {
    init() {
        return AWC.init();
    },

    get appOpened() {
        return isAppOpened;
    },

    configureAppsSettings(app) {
        actualAppController = controllersMap[app.appType];
        if (actualAppController && app.url) {
            return Promise.resolve(makeActualAppSetting(app));
        }
        return Promise.reject(new Error(`app: ${app.title} is not supported by ${app.appType} controller in AWC`));
    },

    openApp({ url, userAgent }) {
        return actualAppController.open()
            .then(() => actualAppController.setUserAgent(userAgent))
            .then(() => actualAppController.open(url))
            .catch(e => logger.error(moduleName, 'openApp', e));
    },

    showApp() {
        return actualAppController.show()
            .then(() => { isAppOpened = true; })
            .catch(e => logger.error(moduleName, 'showApp', e));
    },

    hideApp() {
        return actualAppController.hide()
            .then(() => actualAppController.close())
            .then(() => { isAppOpened = false; })
            .catch(e => logger.error(moduleName, 'hideApp', e));
    },

    onKey(keyCode, keyType) {
        return true;
    },
};
