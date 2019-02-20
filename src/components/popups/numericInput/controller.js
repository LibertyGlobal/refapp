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

const { isNumber, getNumberByNumericKey } = require('shared/helpers');
const { KeyPressTypes } = require('shared/constants');
const { debounce, nop } = require('shared/utils');

const view = require('./view');
const { model } = require('./model');

const INPUT_TIMEOUT = 2000;
const MAX_NUMBER_LENGTH = 2;

let inputEndCallback = nop;

function show({ initialKeyCode = '', onInputEnd = nop } = {}) {
    inputEndCallback = debounce(() => {
        inputEndCallback = nop;
        onInputEnd(model.get('inputValue'));
    }, INPUT_TIMEOUT);

    model.set('inputValue', String(getNumberByNumericKey(initialKeyCode)));
    view.render(model);
    inputEndCallback();
}

function hide() {
    inputEndCallback.cancel && inputEndCallback.cancel();
    inputEndCallback = nop;
    view.clear();
}

function onKey({ keyCode, keyType }) {
    let used = false;

    if (!isNumber(keyCode) || keyType !== KeyPressTypes.keyDown) {
        return used;
    }

    used = true;

    const curValue = model.get('inputValue');
    const char = String(getNumberByNumericKey(keyCode));
    const newValue = curValue.concat(char);

    /**
     * user input ended but input popup is still top component
     * because of tunning and delay in progress
     * swallow all numeric keys to prevent global numeric handling
     */
    if (inputEndCallback === nop) {
        return used;
    }

    model.set('inputValue', newValue);
    model.updateView();

    newValue.length === MAX_NUMBER_LENGTH
        ? inputEndCallback.cancelAndInvoke()
        : inputEndCallback();

    return used;
}

module.exports = {
    show,
    hide,
    onKey,
};
