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

const { paths, types } = require('./constants');

const mainMenu = require('components/mainMenu');
const channelBar = require('components/channelBar');
const mastHead = require('components/mastHead');
const numericInput = require('components/popups/numericInput');
const apps = require('components/apps');
const warningPopup = require('components/popups/warning');
const player = require('components/player');
const onDemand = require('components/ondemand');
const detailPage = require('components/detailPage');

module.exports = [
    {
        path: paths.mastHead,
        component: mastHead,
        type: types.VIEW,
        children: [
            { path: paths.mainMenu, component: mainMenu, type: types.VIEW },
            { path: paths.channelBar, component: channelBar, type: types.VIEW },
            { path: paths.apps, component: apps, type: types.VIEW },
            { path: paths.player, component: player, type: types.VIEW },
            { path: paths.onDemand, component: onDemand, type: types.VIEW },
        ],
    },
    { path: paths.fullScreen, type: types.VIEW },
    { path: paths.numericInput, component: numericInput, type: types.POPUP },
    { path: paths.warningPopup, component: warningPopup, type: types.POPUP },
    { path: paths.detailPage, component: detailPage, type: types.VIEW },
];
