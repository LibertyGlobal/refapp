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

const { init, go, getTopComponent, back, getNextComponent, restartIterator } = require('./navigator');
const { paths } = require('./constants');

module.exports = {
    init,
    go,
    getTopComponent,
    back,
    paths,
    getNextComponent,
    restartIterator,
};
