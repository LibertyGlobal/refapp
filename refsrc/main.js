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
const { onPreKeyHandler } = require('rcuManager/onPreKey');

process.env.CONFIG = 'config.json';
process.env.SPECIFIC_CASH_ENV = 'demo';

require('lgire')
    .start((scene) => {
        if (typeof px !== 'undefined') {
            global.px = px;
        }
        global.scene = scene;

        try {
            require('boot');
        } catch (e) {
            globalErrorHandler(e);
        }
    }, typeof px !== 'undefined' ? px : undefined);

process.on('uncaughtException', (err) => {
    logger.error('main', 'globalErrorHandler', err);
});

function globalErrorHandler(error) {
    logger.error('main', 'globalErrorHandler', error);
    process.exit(1);
}

module.exports.onPreKeyDown = function ({ keyCode }) {
    return onPreKeyHandler(keyCode);
};
