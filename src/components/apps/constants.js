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

const { SCREEN_SIZE, FONTS } = require('shared/constants');

const APPS_WIDTH = SCREEN_SIZE.width;
const APPS_HEIGHT = SCREEN_SIZE.height;
const APPS_BG_COLOR = '#222222';

const GRID_CONTAINER_TOP = 80;
const GRID_CONTAINER_LEFT = 100;

const APPS_FONT_FAMILY = FONTS.Text;
const APPS_FONT_COLOR = '#ffffff';
const APPS_ACTIVE_COLOR = '#3489cd';
const APPS_INACTIVE_COLOR = '#ffffff';

const SECTION_MARGIN = 20;

const SECTION_HEADER_FONT_SIZE = 30;
const SECTION_HEADER_HEIGHT = 35;
const SECTION_HEADER_WIDTH = 730;
const SECTION_HEADER_MARGIN = 10;

const SECTION_UNDERLINE_HEIGHT = 4;
const SECTION_UNDERLINE_WIDTH = SECTION_HEADER_WIDTH;
const SECTION_UNDERLINE_COLOR = APPS_FONT_COLOR;

const LIST_HEIGHT = 200;

const TILE_LOGO_SIZE = 100;
const TILE_LOGO_ACTIVE_BORDER = [6, 6, 6, 6, 'in'];
const TILE_LOGO_INACTIVE_BORDER = [0, 0, 0, 0, 'in'];
const TILE_TITLE_HEIGHT = 23;
const TILE_TITLE_FONT_SIZE = 18;
const TILE_TITLE_WIDTH = 130;
const TILE_TITLE_MARGIN = 5;

const TILE_MARGIN = 20;
const TILE_WIDTH = TILE_TITLE_WIDTH;
const TILE_HEIGHT = TILE_TITLE_HEIGHT + TILE_LOGO_SIZE;

module.exports = {
    StyleConstants: {
        APPS_WIDTH,
        APPS_HEIGHT,
        APPS_BG_COLOR,
        APPS_FONT_FAMILY,
        GRID_CONTAINER_TOP,
        GRID_CONTAINER_LEFT,
        APPS_FONT_COLOR,
        APPS_ACTIVE_COLOR,
        APPS_INACTIVE_COLOR,
        SECTION_UNDERLINE_HEIGHT,
        SECTION_UNDERLINE_WIDTH,
        SECTION_UNDERLINE_COLOR,
        SECTION_MARGIN,
        SECTION_HEADER_FONT_SIZE,
        SECTION_HEADER_HEIGHT,
        SECTION_HEADER_WIDTH,
        SECTION_HEADER_MARGIN,
        LIST_HEIGHT,
        TILE_LOGO_SIZE,
        TILE_LOGO_ACTIVE_BORDER,
        TILE_LOGO_INACTIVE_BORDER,
        TILE_TITLE_HEIGHT,
        TILE_TITLE_FONT_SIZE,
        TILE_TITLE_WIDTH,
        TILE_TITLE_MARGIN,
        TILE_MARGIN,
        TILE_WIDTH,
        TILE_HEIGHT,
    },
};
