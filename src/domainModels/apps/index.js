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

const { getApplications } = require('./service');

let apps;

function init(formatter) {
    return getApplications()
        .then(formatter)
        .then((data) => {
            apps = data;
        });
}

function getApps() {
    return apps;
}

module.exports = {
    init,
    getApps,
};
