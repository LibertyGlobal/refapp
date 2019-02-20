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

const { EMPTY_URL, PROCESS_NAMES } = require('./constants');
const AwcNetwork = require('./AWC.network');

/**
 * Set the browser user agent
 * @param {string} [userAgent]
 */
function setUserAgent(userAgent) {
    return AwcNetwork.setParameter(PROCESS_NAMES.BROWSER, 'UserAgent', userAgent);
}

/**
 * Wait for the browser to be ready and preloaded for open
 * @returns {Promise<string>}
 */
function waitForBrowserReady() {
    return AwcNetwork.waitForAppReady(PROCESS_NAMES.BROWSER);
}

/**
 * Open browser to URL
 * @param {string} [url] Navigate to URL
 * @returns {Promise<string>}
 */
function open(url = null) {
    const doOpen = () => {

        // Browser is already running
        if (AwcNetwork.isRunning(PROCESS_NAMES.BROWSER)) {

            // No URL to set
            if (!url || AwcNetwork.getParameter(PROCESS_NAMES.BROWSER, 'Url') === url) {
                return Promise.resolve(PROCESS_NAMES.BROWSER);
            }

            // Set URL
            return AwcNetwork.setParameter(PROCESS_NAMES.BROWSER, 'Url', url)
                .then(() => {
                    return AwcNetwork.show(PROCESS_NAMES.BROWSER);
                })
                .then(() => Promise.resolve(PROCESS_NAMES.BROWSER));
        }

        const openUrl = url || EMPTY_URL;

        return AwcNetwork.open(PROCESS_NAMES.BROWSER, [openUrl])
            .then(() => {
                if (url) {
                    return AwcNetwork.show(PROCESS_NAMES.BROWSER)
                        .then(() => Promise.resolve(PROCESS_NAMES.BROWSER));
                }
                return Promise.resolve(PROCESS_NAMES.BROWSER);
            });
    };

    return waitForBrowserReady().then(doOpen);
}

/**
 * Show and focus browser
 * @returns {Promise<string>}
 */
function show() {
    return AwcNetwork.show(PROCESS_NAMES.BROWSER);
}

/**
 * Hide browser
 * @returns {Promise<string>}
 */
function hide() {
    return AwcNetwork.hide(PROCESS_NAMES.BROWSER);
}

/**
 * Close the browser
 * @returns {Promise<string>}
 */
function close() {
    return AwcNetwork.close(PROCESS_NAMES.BROWSER);
}

/**
 * Focus the browser
 * @returns {Promise<string>}
 */
function setFocus() {
    return AwcNetwork.setFocus(PROCESS_NAMES.BROWSER);
}

/**
 * Focus the main UI
 * @returns {Promise<string>}
 */
function clearFocus() {
    return AwcNetwork.setFocus(PROCESS_NAMES.MAIN_UI);
}

function setParameter(value) {
    return AwcNetwork.setParameter(PROCESS_NAMES.BROWSER, 'KeyboardFilter', value);
}

module.exports = {
    setUserAgent,
    setParameter,
    waitForBrowserReady,
    open,
    show,
    hide,
    close,
    setFocus,
    clearFocus,
};
