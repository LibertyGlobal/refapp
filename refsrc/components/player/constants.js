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

const path = require('path');
const { FONTS, SCREEN_SIZE } = require('shared/constants');

const JumpDirections = {
    FORWARD: 'forward',
    BACKWARD: 'backward',
};

const PlayoutModes = {
    LIVE_CHANNEL: 'live_channel',
    VOD: 'vod',
};

const PLAYER_HIDE_TIMEOUT = 10000;
const PLAYER_UPDATE_INTERVAL = 1000;

const JUMP_OFFSET = 30000;

const PLAYER_WIDTH = SCREEN_SIZE.width;
const PLAYER_HEIGHT = 140;
const PLAYER_TOP = SCREEN_SIZE.height - PLAYER_HEIGHT;
const PLAYER_LEFT = 0;
const PLAYER_PADDING = 70;
const PLAYER_GRADIENT = path.resolve(__dirname, './assets/player-gradient.png');
const PLAYER_FONT = FONTS.Text;
const PLAYER_FONT_COLOR = '#ffffff';

const PLAYER_PROGRESS_BAR_TOP = 67;
const PLAYER_PROGRESS_BAR_LEFT = PLAYER_PADDING;
const PLAYER_PROGRESS_BAR_WIDTH = 1145;
const PLAYER_PROGRESS_BAR_HEIGHT = 6;
const PLAYER_PROGRESS_BAR_BG_COLOR = '#2c4e68';
const PLAYER_PROGRESS_BAR_COLOR = '#3489cd';

const TRICKPLAY_CIRCLE = path.resolve(__dirname, './assets/circle_33.png');
const TRICKPLAY_ICON_SIZE = 34;
const TRICKPLAY_ICON_TOP = (PLAYER_PROGRESS_BAR_TOP - (TRICKPLAY_ICON_SIZE / 2)) + (PLAYER_PROGRESS_BAR_HEIGHT / 2);
const TRICKPLAY_ICON_LEFT = PLAYER_PROGRESS_BAR_LEFT - (TRICKPLAY_ICON_SIZE / 2);
const TRCIKPLAY_ICON_TEXT_SIZE = 20;
const TRICKPLAY_ICON_TEXT_TOP = TRCIKPLAY_ICON_TEXT_SIZE / 2;
const TRICKPLAY_ICON_TEXT_LEFT = TRCIKPLAY_ICON_TEXT_SIZE / 2;
const TRICKPLAY_ICON_FONT = FONTS.Icons;
const TRICKPLAY_ICON_FONT_SIZE = 16;
const TRICKPLAY_ICON_FONT_COLOR = PLAYER_FONT_COLOR;
const TRICKPLAY_PLAY = '!';
const TRICKPLAY_PAUSE = '$';

const TIME_PROGRESS_WIDTH = 100;
const TIME_PROGRESS_HEIGHT = 24;
const TIME_PROGRESS_TOP = 20;
const TIME_PROGRESS_LEFT = PLAYER_WIDTH - PLAYER_PADDING - TIME_PROGRESS_WIDTH;
const TIME_PROGRESS_FONT = FONTS.Text;
const TIME_PROGRESS_FONT_COLOR = '#ffffff';
const TIME_PROGRESS_FONT_SIZE = 20;

const ASSET_TITLE_WIDTH = PLAYER_WIDTH / 2;
const ASSET_TITLE_HEIGHT = 36;
const ASSET_TITLE_TOP = 20;
const ASSET_TITLE_LEFT = PLAYER_PADDING + 40;
const ASSET_TITLE_FONT_SIZE = 26;

module.exports = {
    StyleConstants: {
        PLAYER_WIDTH,
        PLAYER_HEIGHT,
        PLAYER_TOP,
        PLAYER_LEFT,
        PLAYER_GRADIENT,
        PLAYER_FONT,
        PLAYER_FONT_COLOR,

        PLAYER_PROGRESS_BAR_TOP,
        PLAYER_PROGRESS_BAR_LEFT,
        PLAYER_PROGRESS_BAR_WIDTH,
        PLAYER_PROGRESS_BAR_HEIGHT,
        PLAYER_PROGRESS_BAR_BG_COLOR,
        PLAYER_PROGRESS_BAR_COLOR,

        TRICKPLAY_CIRCLE,
        TRICKPLAY_ICON_TOP,
        TRICKPLAY_ICON_LEFT,
        TRICKPLAY_ICON_SIZE,
        TRICKPLAY_ICON_FONT,
        TRICKPLAY_ICON_FONT_SIZE,
        TRCIKPLAY_ICON_TEXT_SIZE,
        TRICKPLAY_ICON_TEXT_TOP,
        TRICKPLAY_ICON_TEXT_LEFT,
        TRICKPLAY_ICON_FONT_COLOR,
        TRICKPLAY_PLAY,
        TRICKPLAY_PAUSE,

        TIME_PROGRESS_WIDTH,
        TIME_PROGRESS_HEIGHT,
        TIME_PROGRESS_TOP,
        TIME_PROGRESS_LEFT,
        TIME_PROGRESS_FONT,
        TIME_PROGRESS_FONT_COLOR,
        TIME_PROGRESS_FONT_SIZE,

        ASSET_TITLE_WIDTH,
        ASSET_TITLE_HEIGHT,
        ASSET_TITLE_TOP,
        ASSET_TITLE_LEFT,
        ASSET_TITLE_FONT_SIZE,
    },
    JumpDirections,
    PlayoutModes,
    JUMP_OFFSET,
    PLAYER_HIDE_TIMEOUT,
    PLAYER_UPDATE_INTERVAL,
};
