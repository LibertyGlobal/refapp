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

const ZapTypes = {
    HARD: 'hard',
    SOFT: 'soft',
};

const HIDE_TIMEOUT = 5000;
const NUMERIC_ZAPPING_TIMEOUT = 100;

// style constants

const CB_WIDTH = SCREEN_SIZE.width;
const CB_HEIGHT = 240;
const CB_TOP = SCREEN_SIZE.height - CB_HEIGHT;
const CB_LEFT = 0;
const CB_BG_IMAGE = path.resolve(__dirname, './assets/channel-bar-bottom-gradient.png');

const CH_CONTAINER_WIDTH = 225;
const CH_CONTAINER_HEIGHT = 100;
const CH_CONTAINER_TOP = 60;
const CH_CONTAINER_LEFT = 142;

const CH_NUMBER_WIDTH = 40;
const CH_NUMBER_HEIGHT = 23;
const CH_NUMBER_TOP = 0;
const CH_NUMBER_LEFT = 0;
const CH_NUMBER_FONT_SIZE = 20;

const CH_LOGO_WIDTH = 80;
const CH_LOGO_HEIGHT = 60;
const CH_LOGO_MARGIN = 20;
const CH_LOGO_LEFT = CH_NUMBER_WIDTH + CH_LOGO_MARGIN;
const CH_LOGO_TOP = 0;

const CH_WRAPPER_WIDTH = CH_LOGO_WIDTH + CH_NUMBER_WIDTH + CH_LOGO_MARGIN;

const EPG_INFO_WIDTH = 600;
const EPG_INFO_HEIGHT = 100;
const EPG_INFO_TOP = CH_CONTAINER_TOP;
const EPG_INFO_LEFT = CH_CONTAINER_LEFT + CH_CONTAINER_WIDTH;

const EPG_INFO_TITLE_HEIGHT = 37;
const EPG_INFO_TITLE_TOP = 14;
const EPG_INFO_TITLE_FONT_SIZE = 28;

const EPG_INFO_SECONDARY_TITLE_HEIGHT = 25;
const EPG_INFO_SECONDARY_TITLE_TOP = EPG_INFO_TITLE_TOP + EPG_INFO_TITLE_HEIGHT + 5;
const EPG_INFO_SECONDARY_TITLE_FONT_SIZE = 21;

const EPG_INFO_BOTTOM_LINE_WIDTH = 461;
const EPG_INFO_BOTTOM_LINE_HEIGHT = 1;
const EPG_INFO_BOTTOM_LINE_TOP = EPG_INFO_SECONDARY_TITLE_TOP + EPG_INFO_SECONDARY_TITLE_HEIGHT + 21;
const EPG_INFO_BOTTOM_LINE_COLOR = '#3489cd';

const EPG_INFO_PROGRESS_BAR_WIDTH = EPG_INFO_BOTTOM_LINE_WIDTH;
const EPG_INFO_PROGRESS_BAR_HEIGHT = 6;
const EPG_INFO_PROGRESS_BAR_BG_COLOR = '#2c4e68';
const EPG_INFO_PROGRESS_BAR_COLOR = '#3489cd';

module.exports = {
    StyleConstants: {
        CB_WIDTH,
        CB_HEIGHT,
        CB_TOP,
        CB_LEFT,
        CB_BG_IMAGE,
        CH_CONTAINER_WIDTH,
        CH_CONTAINER_HEIGHT,
        CH_CONTAINER_TOP,
        CH_CONTAINER_LEFT,
        CH_NUMBER_WIDTH,
        CH_NUMBER_HEIGHT,
        CH_NUMBER_TOP,
        CH_NUMBER_LEFT,
        CH_NUMBER_FONT_SIZE,
        CH_LOGO_WIDTH,
        CH_LOGO_HEIGHT,
        CH_LOGO_LEFT,
        CH_LOGO_TOP,
        CH_WRAPPER_WIDTH,
        EPG_INFO_WIDTH,
        EPG_INFO_HEIGHT,
        EPG_INFO_TOP,
        EPG_INFO_LEFT,
        EPG_INFO_TITLE_HEIGHT,
        EPG_INFO_TITLE_TOP,
        EPG_INFO_TITLE_FONT_SIZE,
        EPG_INFO_SECONDARY_TITLE_HEIGHT,
        EPG_INFO_SECONDARY_TITLE_TOP,
        EPG_INFO_SECONDARY_TITLE_FONT_SIZE,
        EPG_INFO_BOTTOM_LINE_WIDTH,
        EPG_INFO_BOTTOM_LINE_HEIGHT,
        EPG_INFO_BOTTOM_LINE_TOP,
        EPG_INFO_BOTTOM_LINE_COLOR,
        EPG_INFO_PROGRESS_BAR_WIDTH,
        EPG_INFO_PROGRESS_BAR_HEIGHT,
        EPG_INFO_PROGRESS_BAR_BG_COLOR,
        EPG_INFO_PROGRESS_BAR_COLOR,
    },
    HIDE_TIMEOUT,
    NUMERIC_ZAPPING_TIMEOUT,
    ZapTypes,
};
