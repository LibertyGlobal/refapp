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

/** @module network/Awc-Network */

const path = require('path');
const logger = require('shared/logger');
const EventEmitter = require('shared/eventEmitter');

const awc = (function () {
    /* eslint-disable global-require, import/no-unresolved */
    try {
        const path = require.resolve('awc');
        const ret = require(path);
        ret.init();
        return ret;
    } catch (e) {
        logger.warn('boot', 'awc is not available', e);
        return null;
    }
    // const ret = require('awc');
    // ret.init();
    // return ret;
}());
const {
    WINDOW_EVENTS,
    STATE_EVENTS,
    AWC_INITIALIZED,
    PROCESS_NAMES,
    STATES,
    DEFAULT_USER_AGENT,
    WINDOW_ACCESSOR_MAP,
    APPS_ACCESSOR_MAP,
    AWC_WINDOW_EVENTS,
    AWC_STATE_CHANGE_EVENTS,
    FIXED_Z_ORDER,
} = require('./constants');

const closingApps = {};
const startingApps = {};
const appSurfaceId = {};
const createdWindowsMap = {};

const moduleName = path.basename(__filename);

let mainWindowSurfaceId;

const initialized = new Promise(resolve => EventEmitter.once(AWC_INITIALIZED, resolve));
/*
    WARNING!!!
    After calling, promise holds state "pending" all the time, since event [WINDOW_EVENTS.CREATED]
    does not emitted at all. For more details, please debug awc.onWindowChange and awc.onStateChange
*/
const mainWindowCreated = new Promise((resolve) => { //eslint-disable-line
    function isMainInited(args) {
        if (args.runId === PROCESS_NAMES.MAIN_UI) {
            mainWindowSurfaceId = args.surfaceId;
            logger.log(moduleName, 'onWindowChange', 'first time (set the main-ui)');
            EventEmitter.removeListener(WINDOW_EVENTS.CREATED, isMainInited);
            awc.setFocus(mainWindowSurfaceId);
            resolve();
        }
    }

    const mainWindow = findWindowBySurfaceRunId(PROCESS_NAMES.MAIN_UI);
    if (mainWindow) {
        isMainInited(mainWindow);
    } else {
        EventEmitter.addListener(WINDOW_EVENTS.CREATED, isMainInited);
    }
});


function findAppByRunId(runId) {
    const existingApps = getAwcApps();
    logger.debug(moduleName, 'getApplicationsInfo', existingApps);
    return existingApps.find(a => a.runId === runId);
}

function findWindowBySurfaceRunId(runId) {
    const existingWindows = getAwcWindows();
    logger.debug(moduleName, 'getWindowsInfo', existingWindows);
    return existingWindows.find(w => w.runId === runId);
}

function getAppByPidOrReqId(pid, reqId) {
    return getAwcApps().find((app) => {
        return pid ? app.pid === pid : app.reqId === reqId;
    });
}

/**
 * Returns a list of registered app processes descriptions
 *
 * Can include the apps status description of the following processes:
 * - browser
 * - subttxrend
 * - nfx
 * - mainui
 * - hsapp
 *
 * @return {AwcApp[]}
 */
function getAwcApps() {
    return (awc.getApplicationsInfo() || []).map((app) => {
        return {
            reqId: app[APPS_ACCESSOR_MAP.REQUEST_ID],
            pid: app[APPS_ACCESSOR_MAP.PID],
            runId: app[APPS_ACCESSOR_MAP.RUN_ID],
            state: app[APPS_ACCESSOR_MAP.STATE],
        };
    });
}

/**
 * Returns a list of app process windows
 *
 * @return {AwcWindow[]}
 */
function getAwcWindows() {
    const runningApps = awc.getApplicationsInfo();

    return (awc.getWindowsInfo() || []).reduce((allWindows, awcWindow) => {
        const app = runningApps.find(a => a[APPS_ACCESSOR_MAP.PID] === awcWindow[WINDOW_ACCESSOR_MAP.PID]);
        const surfaceId = awcWindow[WINDOW_ACCESSOR_MAP.SURFACE_ID];

        let runId;
        if (app) {
            runId = app[APPS_ACCESSOR_MAP.RUN_ID];
            appSurfaceId[surfaceId] = runId;
        } else if (appSurfaceId[surfaceId]) {
            runId = appSurfaceId[surfaceId];
        }

        if (runId) {
            allWindows.push({
                surfaceId,
                pid: awcWindow[WINDOW_ACCESSOR_MAP.PID],
                visible: awcWindow[WINDOW_ACCESSOR_MAP.IS_VISIBLE],
                width: awcWindow[WINDOW_ACCESSOR_MAP.WIDTH],
                height: awcWindow[WINDOW_ACCESSOR_MAP.HEIGHT],
                runId,
            });
        } else {
            logger.warn(moduleName, 'getAwcWindows', 'there is a window without an application');
        }

        return allWindows;
    }, []);
}

awc.onWindowChange = (surfaceId, reason, pid) => {
    logger.log(moduleName, 'onWindowChange', `result: surface(${surfaceId}), reason(${reason}), pid(${pid})`);

    const awcWindow = getAwcWindows().find(w => w.surfaceId === surfaceId);
    if (awcWindow) {
        // If new window created - correct z-index order should be established
        if (AWC_WINDOW_EVENTS[reason] === AWC_WINDOW_EVENTS[0]) {
            appSurfaceId[surfaceId] = awcWindow.runId;
            ensureFixedZOrder();
        }
        logger.log(moduleName, 'onWindowChange', `applied to running app: runId(${awcWindow.runId}) ${WINDOW_EVENTS[AWC_WINDOW_EVENTS[reason]]}`);
        EventEmitter.emit(WINDOW_EVENTS[AWC_WINDOW_EVENTS[reason]], awcWindow);
    } else if (appSurfaceId[surfaceId]) {
        logger.log(moduleName, 'onWindowChange', `applied to not running app: runId(${appSurfaceId[surfaceId]}) ${WINDOW_EVENTS[AWC_WINDOW_EVENTS[reason]]}`);
        EventEmitter.emit(WINDOW_EVENTS[AWC_WINDOW_EVENTS[reason]], {
            surfaceId,
            pid,
            visible: false,
            width: null,
            height: null,
            runId: appSurfaceId[surfaceId],
        });
    }
};

awc.onStateChange = (reqId, reason, status, pid) => {
    logger.log(moduleName, 'onStateChange', `result: req_id(${reqId}), pid(${pid}) reason(${reason}) status(${status})`);

    const app = getAppByPidOrReqId(pid, reqId);
    if (app) {
        logger.log(moduleName, 'onStateChange', `applied to: runId(${app.runId})`);
        EventEmitter.emit(STATE_EVENTS[AWC_STATE_CHANGE_EVENTS[reason]], { appId: app.runId, status });
    }

};

/**
 * Returns value of the given parameter.
 *
 * Current supported paramName:
 * "gfx_plane_resolution" - graphic plan resolution width and height
 *                          separated by "x" (e.g. 1280x720)
 * "Url" - get current url from the application.
 * "UserAgent" - get current user agent from the application.
 *
 * "DefaultUserAgent" - Meant to return the browser default user-agent but may fail:
 * @see https://wikiprojects.upc.biz/display/CTOM/Appstore+integration#Appstoreintegration-Htmlbasedapps
 * @see https://jira.lgi.io/browse/ONEM-4179
 * @see https://github.com/LibertyGlobal/onemw-src/blob/master/elev8-plugins/awc/doc/awc.js#L212
 *
 * @param {string} runId
 * @param {string} paramName
 * @returns {string | null}
 */
function getParameter(runId, paramName) {
    const { pid } = (runId && findAppByRunId(runId)) || {};
    logger.log(moduleName, 'getParameter', paramName);
    const { result, value } = awc.getParameter({ pid, key: paramName });

    // standard behavior
    if (result === 0) {
        return value;
    }

    // DefaultUserAgent fallback on middleware error
    if (paramName === 'DefaultUserAgent') {
        logger.error(moduleName, 'getParameter', 'DefaultUserAgent not returned by the browser -> using static one');
        return DEFAULT_USER_AGENT;
    }

    logger.error(moduleName, 'getParameter', `"${paramName}" was not get (with pid ${pid})`);
    // error result
    return null;
}

/**
 * Used currently to set the Url or the userAgent string of the browser
 *
 * Current supported paramName:
 * "Url" - set current url from the application.
 * "UserAgent" - set current user agent from the application.
 *
 * @param {string} runId
 * @param {string} paramName
 * @param {string} paramValue
 * @returns {Promise<string>}
 */
function setParameter(runId, paramName, paramValue) {
    const app = findAppByRunId(runId);

    if (app && app.pid) {
        const result = awc.setParameter({ pid: app.pid, key: paramName, value: paramValue });
        logger.log(moduleName, 'setParameter', `${runId}: ${paramName} = ${paramValue} (${result})`);

        if (result === 0) {
            return Promise.resolve(runId);
        }
        logger.error(moduleName, 'setParameter', `${paramName} parameter = ${paramValue} was not set`);
    } else {
        logger.error(moduleName, 'setParameter', `${app} app not found`);
    }
    return Promise.reject(new Error(`Failed to set parameter for ${runId}: not running.`));
}

function init(notifySLauncher) {
    logger.log(moduleName, 'init AWC');

    if (!awc) {
        return Promise.reject(new Error('awc is not required'));
    }
    // If the process is launched by root it means it hasn´t been started by the service
    if (process.getuid() === 0) {
        notifySLauncher && notifySLauncher();
    }

    const existingWindows = getAwcWindows();
    return Promise.all(getAwcApps().filter(a => (a.state === STATES.RUNNING) && (a.runId !== PROCESS_NAMES.MAIN_UI)).map((a) => {
        if (existingWindows.find(w => w.runId === a.runId)) {
            return close(a.runId);
        }
        return Promise.resolve();
    })).then(() => {
        logger.log(moduleName, 'AWC is initialized');
        EventEmitter.emit(AWC_INITIALIZED);
    }).catch((e) => {
        EventEmitter.emit(STATE_EVENTS.CRASHED);
        logger.error(moduleName, 'unable to init AWC', e);
    });
}

/**
 * Open application. Returns a promise when the application window is ready.
 * @param {string} runId Application ID
 * @param {Array} args Application arguments
 * @param {Boolean} dontWaitForWindow
 * @param {Boolean} isStartingSuspended
 * @returns {Promise<[any , any]>}
 */
function open(runId, args = [], dontWaitForWindow = false, isStartingSuspended = false) {
    /**
     * @type {Promise.<T>}
     */
    return Promise.all([initialized]).then(() => {
        const doOpen = () => {
            logger.log(moduleName, 'open', runId, args);

            startingApps[runId] = !isStartingSuspended;

            const waitForAppReadyPromise = dontWaitForWindow ? waitForAppStarted : waitForWindowCreated;

            const appStarted = () => {
                delete startingApps[runId];
                return Promise.resolve(runId);
            };

            if (isRunning(runId)) {
                logger.log(moduleName, 'open -> already running', runId, args);
                return waitForAppReadyPromise(runId).then(appStarted);
            }

            logger.log(moduleName, 'open -> start', runId, args);

            const requestId = (runId === PROCESS_NAMES.BROWSER)
                ? awc.start(runId, args, ['visible=0'])
                : awc.start(runId, args);

            if (requestId === -1) {
                delete startingApps[runId];
                return Promise.reject(new Error(`Failed to start ${runId}.`));
            }

            return waitForAppReadyPromise(runId).then(appStarted);
        };

        let waitForPromise = Promise.resolve(runId);

        // Already starting
        if (isStarting(runId)) {
            waitForPromise = dontWaitForWindow ? waitForAppStarted(runId) : waitForWindowCreated(runId);
        } else {
            startingApps[runId] = !isStartingSuspended; // Init opening process
        }

        // App is closing
        if (isClosing(runId)) {
            waitForPromise = waitForWindowClosed(runId);
        }

        return waitForPromise.then(doOpen);
    });
}

function show(runId) {
    const awcWindow = findWindowBySurfaceRunId(runId);
    if (awcWindow && awcWindow.surfaceId >= 0) {
        awc.setVisible(awcWindow.surfaceId, true);
        awc.setOpacity(awcWindow.surfaceId, 1);
        awc.setFocus(awcWindow.surfaceId);
    }
    logger.log(moduleName, 'show', runId);
    return Promise.resolve(runId);
}

function hide(runId) {
    logger.log(moduleName, 'hide', runId);
    setVisible(runId, false);
    return Promise.resolve(runId);
}

function pause(runId) {
    setParameter(runId, 'Speed', '0');
}

function play(runId) {
    setParameter(runId, 'Speed', '100');
}

function setVisible(runId, value) {
    const awcWindow = findWindowBySurfaceRunId(runId);

    if (awcWindow && awcWindow.surfaceId >= 0) {
        awc.setVisible(awcWindow.surfaceId, value);
    }
}

/**
 * Return app state
 * @param {string} runId
 * @returns {string}
 */
function getState(runId) {
    const data = findAppByRunId(runId);
    return data ? data.state : null;
}

/**
 * Returns true if the application is running
 * @param {string} runId
 * @returns {boolean}
 */
function isRunning(runId) {
    const data = findAppByRunId(runId);
    return data ? data.pid && data.state === STATES.RUNNING : false;
}

/**
 * Returns true if the application is being closed
 * @param {string} runId
 * @returns {boolean}
 */
function isClosing(runId) {
    return closingApps[runId] === true;
}

/**
 * Returns true if the application is being started
 * @param {string} runId
 * @returns {boolean}
 */
function isStarting(runId) {
    return startingApps[runId] === true;
}

/**
 * Returns true if the application window is visible
 * @param {string} runId
 * @returns {boolean}
 */
function isVisible(runId) {
    const data = findWindowBySurfaceRunId(runId);
    return data ? data.visible : false;
}

function ensureFixedZOrder() {
    const sorter = (a, b) => FIXED_Z_ORDER.indexOf(a.runId) > FIXED_Z_ORDER.indexOf(b.runId);
    getAwcWindows().sort(sorter).forEach((awcWindow, index) => {
        awc.setZorder(awcWindow.surfaceId, index);
        logger.log(moduleName, `ensureFixedZOrder ${awcWindow.surfaceId}::${awcWindow.runId} to layer ${index}`);
    });
}

function setPosition(runId, x, y) {
    const awcWindow = findWindowBySurfaceRunId(runId);
    if (awcWindow) {
        // Just moved this log inside the condition check to ensure 'surface' exists
        logger.log(moduleName, 'setPosition', runId, x, y, 'SURFACE_ID', awcWindow.surfaceId);
        awc.setPosition(awcWindow.surfaceId, x, y);
    }
}

function setFocus(runId) {
    const awcWindow = findWindowBySurfaceRunId(runId);
    logger.debug(moduleName, 'setFocus', runId, awcWindow);
    if (awcWindow) {
        awc.setFocus(awcWindow.surfaceId);
    } else {
        // Default to the main window. The main UI is no longer held as a surface
        // but there are cases where we want to give the main UI focus, for example
        // when a popup is raised above a browser we want to stop key presses reaching
        // the browser
        awc.setFocus(mainWindowSurfaceId);
    }
}


function setScale(runId, scaleX, scaleY) {
    const awcWindow = findWindowBySurfaceRunId(runId);
    if (awcWindow) {
        logger.log(moduleName, 'setScale', runId, scaleX, scaleY, 'SURFACE_ID', awcWindow.surfaceId);
        awc.setScale(awcWindow.surfaceId, scaleX, scaleY);
    }
}

function setSize(runId, w, h) {
    const awcWindow = findWindowBySurfaceRunId(runId);
    if (awcWindow) {
        logger.log(moduleName, `setSize -> runId -> ${runId} ( w: ${w}, h: ${h} )`, 'SURFACE_ID', awcWindow.surfaceId);
        awc.setSize(awcWindow.surfaceId, w, h);
    }
}

function getSize(runId) {
    let size = [0, 0];

    const awcWindow = findWindowBySurfaceRunId(runId);
    if (awcWindow) {
        size = [awcWindow.width, awcWindow.height];
        logger.log(moduleName, `getSize -> runId -> ${runId}`, size, 'SURFACE_ID', awcWindow.surfaceId);
    }
    return size;
}

function suspend(runId, args) {
    let ret;
    const app = findAppByRunId(runId);
    if (app && app.pid) {
        const { pid } = app;
        logger.log(moduleName, 'suspend', pid, 'SURFACE_ID', pid, 'args', args);
        const result = awc.suspend(pid, args);
        if (result === 0) {

            return waitForAppSuspended(runId)
                .then(() => {
                    logger.log(moduleName, 'close -> app successfully suspended', runId, args);
                    return Promise.resolve(runId);
                });
        }

        ret = Promise.reject(new Error(`suspend call has failed for: ${runId}`));

    } else {
        ret = Promise.reject(new Error(`No application to suspend with id: ${runId}`));
    }

    return ret;
}

function close(runId, args) {
    logger.log(moduleName, 'close', runId, args);

    const doClose = () => {
        closingApps[runId] = true;
        const app = findAppByRunId(runId);
        if (app && app.pid) {
            logger.log(moduleName, 'close -> closing running app', runId, args);
            const result = awc.stop(app.pid, args);
            if (result === 0) {
                const windowClosedPromise = createdWindowsMap[runId] ? waitForWindowClosed(runId, true) : Promise.resolve();

                return Promise.all([waitForAppStopped(runId, true), windowClosedPromise])
                    .then(() => {
                        logger.log(moduleName, 'close -> app successfully closed', runId, args);
                        delete closingApps[runId];
                        return Promise.resolve(runId);
                    });
            }
            delete closingApps[runId];
            return Promise.reject(new Error(`awc -> stop call has failed for: ${runId}`));
        }
        // App already closed
        logger.log(moduleName, 'close -> app already closed', runId);

        return waitForWindowClosed(runId)
            .then(() => {
                delete closingApps[runId];
                return Promise.resolve(runId);
            });
    };

    let waitForPromise = Promise.resolve(runId);

    if (isStarting(runId)) { // App is starting
        waitForPromise = Promise.all([waitForAppStarted(runId), waitForWindowCreated(runId)]);
    } else if (isClosing(runId)) { // Already closing
        waitForPromise = Promise.all([waitForAppStopped(runId), waitForWindowClosed(runId)]);
    } else { // Init closing process
        closingApps[runId] = true;
    }

    return waitForPromise.then(doClose);
}

/**
 * Wait for the app to start without waiting for the window to be created
 * @param {string} appId
 * @param {boolean} [waitForEvent]
 * @returns {Promise<any>}
 */
function waitForAppStarted(appId, waitForEvent = false) {
    const existingApp = findAppByRunId(appId);
    if (existingApp && existingApp.pid && !waitForEvent) {
        logger.log(moduleName, 'waitForAppStarted: app is already running', appId);
        return Promise.resolve(appId);
    }

    return new Promise((resolve) => {
        function appStarted({ appId: id } = {}) {
            if (id === appId) {
                EventEmitter.removeListener(STATE_EVENTS.RUNNING, appStarted);
                logger.log(moduleName, 'waitForAppStarted: App started', appId);
                resolve(appId);
            }
        }
        logger.log(moduleName, 'waitForAppStarted: waiting for app to start', appId);
        EventEmitter.addListener(STATE_EVENTS.RUNNING, appStarted);
    });
}

/**
 * Wait for the app to start and it's window to be created
 * @param {string} appId
 * @param {boolean} [waitForEvent]
 * @returns {Promise<any>}
 */
function waitForWindowCreated(appId, waitForEvent = false) {
    const awcWindow = findWindowBySurfaceRunId(appId);
    if (awcWindow && !waitForEvent) {
        logger.log(moduleName, 'waitForWindowCreated: window was already created', appId);
        return Promise.resolve(appId);
    }

    return new Promise((resolve) => {
        function windowCreated(createdAwcWindow) {
            if (createdAwcWindow.runId === appId) {
                EventEmitter.removeListener(WINDOW_EVENTS.CREATED, windowCreated);
                logger.log(moduleName, 'waitForWindowCreated: Window created', appId);
                createdWindowsMap[appId] = true;
                resolve(appId);
            }
        }
        logger.log(moduleName, 'waitForWindowCreated: waiting for window to be created', appId);
        EventEmitter.addListener(WINDOW_EVENTS.CREATED, windowCreated);
    });
}

/**
 * Wait for the app to stop
 * @param {string} appId
 * @param {boolean} [waitForEvent]
 * @returns {Promise<any>}
 */
function waitForAppStopped(appId, waitForEvent = false) {
    if (!isRunning(appId) && !waitForEvent) {
        logger.log(moduleName, 'waitFoAppStopped: app has already been stopped', appId);
        return Promise.resolve(appId);
    }

    return new Promise((resolve) => {
        function appStopped({ appId: id } = {}) {
            if (id === appId) {
                EventEmitter.removeListener(STATE_EVENTS.STOPPED, appStopped);
                logger.log(moduleName, 'waitFoAppStopped: app stopped', appId);
                resolve(appId);
            }
        }
        logger.log(moduleName, 'waitFoAppStopped: waiting for app to be stopped', appId);
        EventEmitter.addListener(STATE_EVENTS.STOPPED, appStopped);
    });
}


/**
 * Wait for the app to be suspended
 * @param {string} appId
 * @param {boolean} [waitForEvent]
 * @returns {Promise<any>}
 */
function waitForAppSuspended(appId) {
    if (!isRunning(appId)) {
        logger.log(moduleName, 'waitForAppSuspended: app has already been suspended', appId);
        return Promise.resolve(appId);
    }

    return new Promise((resolve) => {
        function appSuspended({ appId: id } = {}) {
            if (id === appId) {
                EventEmitter.removeListener(STATE_EVENTS.SUSPENDED, appSuspended);
                logger.log(moduleName, 'waitForAppSuspended: app suspended', appId);
                resolve(appId);
            }
        }
        logger.log(moduleName, 'waitForAppSuspended: waiting for app to be suspended', appId);
        EventEmitter.addListener(STATE_EVENTS.SUSPENDED, appSuspended);
    });
}

/**
 * Wait for the app window to be destroyed
 * @param {string} appId
 * @param {boolean} [waitForEvent]
 * @returns {Promise<any>}
 */
function waitForWindowClosed(appId, waitForEvent = false) {
    if (!findWindowBySurfaceRunId(appId) && !waitForEvent) {
        logger.log(moduleName, 'waitForWindowClosed: window was already destroyed', appId);
        return Promise.resolve(appId);
    }

    return new Promise((resolve) => {
        function windowDestroyed(destroyedAwcWindow) {
            if (destroyedAwcWindow.runId === appId) {
                EventEmitter.removeListener(WINDOW_EVENTS.DESTROYED, windowDestroyed);
                logger.log(moduleName, 'waitForWindowClosed: window destroyed', appId);
                createdWindowsMap[appId] = false;
                resolve(appId);
            }
        }
        logger.log(moduleName, 'waitForWindowClosed: waiting for window to be destroyed', appId);
        EventEmitter.addListener(WINDOW_EVENTS.DESTROYED, windowDestroyed);
    });
}

/**
 * Wait for the app to be ready (no opening or closing in progress)
 * @param {string} runId
 * @returns {Promise<string>}
 */
function waitForAppReady(runId) {
    logger.log(moduleName, 'waitForAppReady', runId);

    if (isClosing(runId)) {
        return Promise.all([waitForAppStopped(runId), waitForWindowClosed(runId)]);
    }

    if (isStarting(runId)) {
        return Promise.all([waitForAppStarted(runId), waitForWindowCreated(runId)]);
    }

    logger.log(moduleName, 'waitForAppReady: App already ready', runId);
    return Promise.resolve(runId);
}

module.exports = {
    init,
    open,
    show,
    suspend,
    hide,
    close,
    pause,
    play,
    ensureFixedZOrder,
    setScale,
    setSize,
    getParameter,
    setPosition,
    setFocus,
    getSize,
    setParameter,
    waitForAppStarted,
    waitForWindowCreated,
    waitForWindowClosed,
    findWindowBySurfaceRunId,
    waitForAppReady,
    isRunning,
    isStarting,
    isClosing,
    isVisible,
    getState,
    setVisible,
    AWC_STATE_CHANGE_EVENTS,
};
