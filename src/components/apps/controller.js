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

const { Keys, KeyPressTypes } = require('shared/constants');
const navigator = require('navigation');
const appManager = require('appManager');
const logger = require('shared/logger');
const channelDomainModel = require('domainModels/channel');

const view = require('./view');
const { model, changeActiveSection, changeActiveTile, getActiveTile } = require('./model');

const MODULE_NAME = 'apps/controller';

function show() {
    view.render(model);
}

function hide() {
    model.set('selectionCoordinates', [0, 0]);
    view.clear();
}

function handleKeyWhenAppOpened(keyCode) {
    logger.info(MODULE_NAME, 'handleKeyWhenAppOpened', `keyCode: ${keyCode}`);
    switch (keyCode) {
        case Keys.BackToTV:
        case Keys.Power:
            appManager.closeApp();
            return true;
        default:
            return false;
    }
}

function basicKeyHandling(keyCode) {
    switch (keyCode) {
        case Keys.Back:
        case Keys.BackToTV:
            channelDomainModel.setCurrentChannel(channelDomainModel.getCurrentChannel())
                .then(() => navigator.go(navigator.paths.channelBar))
                .catch(err => logger.error(MODULE_NAME, 'basicKeyHandling: BackToTV & Back', err));
            break;
        case Keys.Menu:
            channelDomainModel.setCurrentChannel(channelDomainModel.getCurrentChannel())
                .then(() => navigator.go(navigator.paths.mainMenu))
                .catch(err => logger.error(MODULE_NAME, 'basicKeyHandling: Menu', err));
            break;
        case Keys.Left:
            changeActiveTile('backward');
            model.updateView();
            break;
        case Keys.Right:
            changeActiveTile('forward');
            model.updateView();
            break;
        case Keys.Up:
            changeActiveSection('backward');
            model.updateView();
            break;
        case Keys.Down:
            changeActiveSection('forward');
            model.updateView();
            break;
        case Keys.Enter:
            if (appManager.isPlayingAppAvailable()) {
                appManager.showApp(getActiveTile());
            }
            break;
        default:
    }
    return true;
}

function onKey({ keyCode, keyType }) {

    if (keyType !== KeyPressTypes.keyDown) {
        return false;
    }

    if (appManager.appOpened) {
        return handleKeyWhenAppOpened(keyCode);
    }

    return basicKeyHandling(keyCode);
}

function onPreKeyDown(keyCode) {
    let dontPropagateKey = false;
    if (appManager.appOpened) {
        switch (keyCode) {
            case Keys.BackToTV:
            case Keys.Power:
                appManager.closeApp();
                dontPropagateKey = true;
                break;
            default:
                break;
        }
    }
    return dontPropagateKey;
}

module.exports = {
    show,
    hide,
    onKey,
    onPreKeyDown,
    name: 'Apps',
};

