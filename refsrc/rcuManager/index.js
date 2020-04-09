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
const { paths, go, back, getNextComponent, restartIterator } = require('navigation');

const keyEventsEmitter = require('shared/eventEmitter');
const { Events, Keys, KeyPressTypes } = require('shared/constants');
const { ChannelChangeTypes } = require('./constants');
const { isNumber } = require('shared/helpers');
const {
    onNumericInput,
    onChannelChange,
    onBackToTv,
} = require('./globalHandlers');

const MODULE_NAME = 'rcuManager';

function globalHandler({ keyCode, keyType }) {
    logger.info(MODULE_NAME, 'globalHandler', 'codes: ', keyCode, Keys.Down);
    logger.info(MODULE_NAME, 'globalHandler', 'is number ', isNumber(keyCode));
    switch (true) {
        case (keyType !== KeyPressTypes.keyDown):
            return;
        case isNumber(keyCode):
            onNumericInput({ keyCode, keyType });
            break;
        default:
    }

    switch (keyCode) {
        case Keys.Menu:
            go(paths.mainMenu);
            break;
        case Keys.Back:
            back();
            break;
        case Keys.Enter:
            go(paths.channelBar);
            break;
        case Keys.ChDown:
            onChannelChange(ChannelChangeTypes.CHDOWN);
            break;
        case Keys.ChUp:
            onChannelChange(ChannelChangeTypes.CHUP);
            break;
        case Keys.Up:
        case Keys.Down:
            logger.log(MODULE_NAME, 'Key Up, Down -> ', paths.channelBar);
            go(paths.channelBar);
            break;
        case Keys.BackToTV:
            onBackToTv();
            break;
        default:
    }
}

keyEventsEmitter.on(Events.KEY_PRESSED, (keyEvent) => {
    logger.info(MODULE_NAME, 'keyPressHandler', 'received key event: ', keyEvent);

    restartIterator();
    let component = getNextComponent();
    let done = false;

    while (component && !done) {
        done = component.onKey(keyEvent);
        component = getNextComponent();
    }

    if (!done) {
        globalHandler(keyEvent);
    }
});
