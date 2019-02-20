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

function getDateString() {
    return new Date().toISOString();
}

function getLogPrefix(method, moduleName, functionName) {
    return [`[${getDateString()}][${method}]`, moduleName, functionName, ''].join(' ::: ');
}

/* eslint-disable no-console*/
module.exports = {
    info(moduleName, functionName, ...args) {
        console.info(getLogPrefix('INFO', moduleName, functionName), ...args);
    },
    error(moduleName, functionName, ...args) {
        console.error(getLogPrefix('ERROR', moduleName, functionName), ...args);
    },
    warn(moduleName, functionName, ...args) {
        console.warn(getLogPrefix('WARN', moduleName, functionName), ...args);
    },
    debug(moduleName, functionName, ...args) {
        console.log(getLogPrefix('DEBUG', moduleName, functionName), ...args);
    },
    log(moduleName, functionName, ...args) {
        console.log(getLogPrefix('LOG', moduleName, functionName), ...args);
    },
};
