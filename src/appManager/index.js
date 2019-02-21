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
const { go, paths } = require('navigation');
const renderer = require('renderer');

const MODULE_NAME = 'appManager';

const appWindowControllers = new Map();
let currentAppsWindowController;

function isWindowControllerAvailable(key) {
    return appWindowControllers.has(key) && appWindowControllers.get(key);
}

module.exports = {
    init() {
        if (this.isPlayingAppAvailable()) {
            return currentAppsWindowController.init();
        }
        return Promise.resolve();
    },

    get appOpened() {
        return currentAppsWindowController && currentAppsWindowController.appOpened;
    },

    isPlayingAppAvailable() {
        return Boolean(appWindowControllers.size);
    },

    injectAppsWindowController(key, appsWindowController) {
        appWindowControllers.set(key, appsWindowController);
        currentAppsWindowController = appsWindowController;
        logger.log(MODULE_NAME, 'injectAppsWindowController', 'successful');
    },

    changeCurrentAppsWindowController(key) {
        if (isWindowControllerAvailable(key)) {
            currentAppsWindowController = appWindowControllers.get(key);
        }
        logger.info(MODULE_NAME, 'currentAppsWindowController', `there is no available AppsWindowController by ${key}`);
    },

    showApp(app) {
        if (currentAppsWindowController.isAppSupported(app)) {
            return currentAppsWindowController.configure(app)
                .then(settings => currentAppsWindowController.open(settings))
                .then(() => currentAppsWindowController.show())
                .then(() => renderer.setMainViewVisibility(false))
                .catch(e => logger.error(MODULE_NAME, 'showApp', e));
        }
        const popupProps = {
            title: 'App is not available',
            content: 'Implementation is planned for future versions of the application',
        };
        go(paths.warningPopup, popupProps);
        return Promise.resolve();
    },

    closeApp() {
        return currentAppsWindowController.hide().then(() => renderer.setMainViewVisibility(true));
    },

    suspendApp() {
        return currentAppsWindowController.suspend();
    },
};
