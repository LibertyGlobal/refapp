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

const keyEventsEmitter = require('shared/eventEmitter');
const { Events, KeyPressTypes, Keys } = require('shared/constants');
const { throttleWithoutLastCall } = require('shared/utils');
const mapKeyCode = require('shared/mapKeyCode');
const logger = require('shared/logger');

const MODULE_NAME = 'keyboardKeyEmitter';

let keyTypeCount;
let keyPrevType;

const throttledNotifyKeyPressEnter = throttleWithoutLastCall(notifyKeyPress, 700);

function subscribe() {
    if (typeof scene === 'undefined') {
        logger.warn('scene type: undefined');
        return;
    }

    scene.root.on('onKeyDown', ({ keyCode }) => {
        const appCode = mapKeyCode(keyCode);
        logger.log(MODULE_NAME, 'onKeyDown', 'code:', keyCode, appCode);
        if (appCode === Keys.Enter) {
            throttledNotifyKeyPressEnter(KeyPressTypes.keyDown, keyCode);
        } else {
            notifyKeyPress(KeyPressTypes.keyDown, keyCode);
        }
    });

    scene.root.on('onKeyUp', ({ keyCode }) => {
        // logger.log(MODULE_NAME, 'onKeyUp', 'code:', keyCode);
        notifyKeyPress(KeyPressTypes.keyUp, keyCode);
    });
}

function notifyKeyPress(keyType, keyCode) {
    const appKeyCode = mapKeyCode(keyCode);

    keyTypeCount = (keyPrevType === keyType) ? keyTypeCount + 1 : 0;
    keyPrevType = keyType;

    logger.log(MODULE_NAME, 'handling keyPress', 'code:', appKeyCode, 'type:', keyType, 'keyTypeCount:', keyTypeCount);
    keyEventsEmitter.emit(Events.KEY_PRESSED, { keyCode: appKeyCode, keyType, keyTypeCount });
}

subscribe();
