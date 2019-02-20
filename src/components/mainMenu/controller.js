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

const { model, moveLeft, moveRight, getSelectedItem } = require('./model');
const view = require('./view');
const logger = require('shared/logger');
const { Keys, KeyPressTypes } = require('shared/constants');
const { back, go } = require('navigation');
const player = require('domainModels/player');

const MODULE_NAME = 'main-menu/controller';

function show() {
    return view.render(model);
}

function hide() {
    view.clean();
}

const keysToHandle = new Set([Keys.Left, Keys.Right]);

function downAndRepeatHandler({ keyCode, keyType }) {

    if (keyType === KeyPressTypes.keyUp || !keysToHandle.has(keyCode)) {
        return false;
    }

    switch (keyCode) {
        case Keys.Left:
            moveLeft();
            model.updateView();
            return true;
        case Keys.Right:
            moveRight();
            model.updateView();
            return true;
        default:
            return false;
    }
}

function downHandler({ keyCode }) {
    const { path, props } = getSelectedItem();
    const promise = props.isStopPlayBackManually ? player.stopPlayBack() : Promise.resolve();
    switch (keyCode) {
        case Keys.Menu:
            back();
            return true;
        case Keys.Enter:
            promise
                .then(() => go(path, props))
                .catch(e => logger.error(MODULE_NAME, 'downHandler: enter', e));
            return true;
        default:
            return false;
    }
}

function onKey({ keyType, keyCode }) {
    logger.info(MODULE_NAME, 'onKey');
    let used = false;

    used = downAndRepeatHandler({ keyCode, keyType });

    if (keyType !== KeyPressTypes.keyDown || used) {
        return used;
    }

    return downHandler({ keyCode, keyType });
}

module.exports = {
    show,
    hide,
    onKey,
    name: 'Main menu',
};
