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

const { SCREEN_SIZE } = require('shared/constants');
const path = require('path');

const MAST_HEAD_WIDTH = SCREEN_SIZE.width;
const MAST_HEAD_HEIGHT = 166;
const MAST_HEAD_TOP = 10;
const MAST_HEAD_BG_IMG = path.resolve(__dirname, './assets/header_gradient_default.png');
const ITEM_WIDTH = 300;
const ITEM_HEIGHT = 30;
const FONT_SIZE = 25;
const LOGO_HEIGHT = 40;
const LOGO_WIDTH = 160;
const LOGO_LEFT = ~~((SCREEN_SIZE.width / 2) - (LOGO_WIDTH / 2));

module.exports = {
    StyleConstants: {
        MAST_HEAD_WIDTH,
        MAST_HEAD_HEIGHT,
        MAST_HEAD_TOP,
        MAST_HEAD_BG_IMG,
        ITEM_WIDTH,
        ITEM_HEIGHT,
        FONT_SIZE,
        LOGO_LEFT,
        LOGO_HEIGHT,
        LOGO_WIDTH,
    },
};
