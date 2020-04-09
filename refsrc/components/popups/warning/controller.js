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
const { setSystemInterval, clearSystemInterval } = require('domainModels/system');
const navigator = require('navigation');
const { Keys, KeyPressTypes } = require('shared/constants');
const view = require('./view');
const { model, addStaticData } = require('./model');

const MODULE_NAME = 'popups/warning';

const POPUP_LIFE_TIME = 5;

function show({ title, content }) {
    addStaticData(title, content);
    setSystemInterval(POPUP_LIFE_TIME, navigator.back);
    view.render(model);
}

function hide() {
    clearSystemInterval(navigator.back);
    view.clear();
}

function onKey({ keyCode, keyType }) {
    logger.info(MODULE_NAME, 'onKey');
    if (keyType === KeyPressTypes.keyDown) {
        switch (keyCode) {
            case Keys.Back:
                return false;
            default:
                return true;
        }
    }
    return false;
}

module.exports = {
    show,
    hide,
    onKey,
};
