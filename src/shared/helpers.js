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

const { NumericKeyCodeMap } = require('./constants');

function isNumber(key) {
    return key > 47 && key < 58;
}

function getNumberByNumericKey(keyCode) {
    return NumericKeyCodeMap.get(keyCode);
}

module.exports = {
    isNumber,
    getNumberByNumericKey,
};
