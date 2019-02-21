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
const { getNextComponent, restartIterator } = require('navigation');

const MODULE_NAME = 'onPreKeyManager';

let mapKeyCode;

function init() {
    mapKeyCode = require('shared/mapKeyCode');
}

function onPreKeyHandler(pxKeyCode) {
    let done = false;
    if (mapKeyCode) {
        const keyCode = mapKeyCode(pxKeyCode);
        logger.info(MODULE_NAME, 'preKeyPressHandler', 'received keyCode: ', keyCode);
        restartIterator();
        let component = getNextComponent();

        while (component && component.onPreKeyDown && !done) {
            done = component.onPreKeyDown(keyCode);
            component = getNextComponent();
        }
    }
    return done;
}

module.exports = {
    init,
    onPreKeyHandler,
};
