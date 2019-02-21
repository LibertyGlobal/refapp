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

const ViewModel = require('shared/ViewModel');

const model = new ViewModel();

model.set('time', '');

function setOpenedViewTitle(openedViewName) {
    model.openedViewName = openedViewName;
}

function setTime(time) {
    const formattedTime = new Date(time).toTimeString().slice(0, 5);
    model.set('time', formattedTime);
}

module.exports = {
    model,
    setOpenedViewTitle,
    setTime,
};
