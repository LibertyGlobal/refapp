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
const EventEmitter = require('shared/eventEmitter');
const { events, DEFAULT_APP_PROPS, appTypesMap, INITIAL_APP_ID, appStatuses } = require('./constants');

const moduleName = 'optimus.network';

let optimus;
let actualApp;
let actualAppId;
let applications;
let mainApp;
let appId = INITIAL_APP_ID;
const launchedApps = new Set();

const initialized = new Promise(resolve => EventEmitter.once(events.OPTIMUS_INITIALIZED, resolve));

module.exports = {
    init() {
        return px.import({
            Optimus: 'optimus.js',
        }).then(({ Optimus }) => {
            optimus = Optimus;
            applications = optimus.getApplications();
            [mainApp] = applications;
            EventEmitter.emit(events.OPTIMUS_INITIALIZED);
            logger.log(moduleName, 'init', 'optimus successfully initialized');
        }).catch((e) => { logger.error(moduleName, 'init', e); });
    },

    get appOpened() {
        return launchedApps.size && launchedApps.has(actualAppId);
    },

    isAppSupported(app) {
        return appTypesMap[app.appType] && (app.url || app.cmd);
    },

    configure(app) {
        appId += 1;
        let launchParams = {};
        let displayName;
        switch (app.appType) {
            case 'dac':
                displayName = "wayland-dac-0";
                // fall through
            case 'native':
            case 'browser':
                launchParams = { cmd: app.cmd };
                break;
            default:
                launchParams = { cmd: appTypesMap[app.appType], uri: app.url };
                break;
        }

        return Promise.resolve(Object.assign(DEFAULT_APP_PROPS, {
            id: appId,
            launchParams,
            displayName: displayName
        }));
    },

    open(settings) {
        logger.log(moduleName, 'open', 'open app with settings', settings);
        let hidePromise;
        if (this.appOpened) {
            hidePromise = this.hide();
        } else {
            hidePromise = Promise.resolve();
        }
        return Promise.all([initialized, hidePromise]).then(() => {
            if (!launchedApps.has(settings.id)) {
                logger.log(moduleName, 'open', 'create app with settings');
                actualApp = optimus.createApplication(settings);
                launchedApps.add(settings.id);
            } else {
                logger.log(moduleName, 'open', 'get app by id', settings.id);
                actualApp = optimus.getApplicationById((settings.id));
            }
            actualAppId = settings.id;
        });
    },

    show() {
        logger.log(moduleName, 'show', actualAppId);
        actualApp.moveForward();
        actualApp.setFocus(true);
        return Promise.resolve();
    },

    hide() {
        if (this.appOpened) {
            logger.log(moduleName, 'hide', actualAppId);
            actualApp.setFocus(false);
            actualApp.destroy();
            mainApp.moveForward();
            mainApp.setFocus(true);
            launchedApps.delete(actualAppId);
        } else {
            logger.log(moduleName, 'hide', 'there is no app to hide');
        }
        return Promise.resolve();
    },

    suspend() {
        if (this.appOpened) {
            logger.log(moduleName, 'suspend', 'app', actualAppId);
            actualApp.suspend({});
        } else {
            logger.log(moduleName, 'suspend', 'there is no app to suspend');
        }
        return Promise.resolve();
    },

    resume() {
        if (actualApp.status() === appStatuses.SUSPENDED) {
            logger.log(moduleName, 'resume', 'app', actualAppId);
            actualApp.resume({});
        } else {
            logger.log(moduleName, 'resume', `the app: ${actualAppId} is not suspended`);
        }
        return Promise.resolve();
    },
};
