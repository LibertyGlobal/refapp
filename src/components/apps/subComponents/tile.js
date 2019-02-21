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

const { StyleConstants } = require('../constants');
const { elementIdGetters } = require('../helpers');
const list = require('renderer/list');
const { listDirections } = require('shared/constants');

let counter = 0;

const getIndex = () => counter++;

module.exports = function (poster, title, sectionType, index = getIndex(), sectionIdx) {
    return list({
        idPrefix: 'tile',
        elements: [
            {
                id: elementIdGetters.tileLogo(sectionType, index),
                styles: {
                    height: StyleConstants.TILE_LOGO_SIZE,
                    width: StyleConstants.TILE_LOGO_SIZE,
                    border: index === 0 && sectionIdx === 0
                        ? StyleConstants.TILE_LOGO_ACTIVE_BORDER
                        : StyleConstants.TILE_LOGO_INACTIVE_BORDER,
                    borderColor: StyleConstants.APPS_ACTIVE_COLOR,
                    backgroundImage: poster,
                    align: 'center',
                },
            },
            {
                id: elementIdGetters.tileTitle(sectionType, index),
                styles: {
                    width: StyleConstants.TILE_TITLE_WIDTH,
                    height: StyleConstants.TILE_TITLE_HEIGHT,
                    fontSize: StyleConstants.TILE_TITLE_FONT_SIZE,
                    fontFamily: StyleConstants.APPS_FONT_FAMILY,
                    fontColor: index === 0 && sectionIdx === 0
                        ? StyleConstants.APPS_ACTIVE_COLOR
                        : StyleConstants.APPS_INACTIVE_COLOR,
                    textAlign: 'center',
                    text: title,
                },
            },
        ],
        elemMargin: StyleConstants.TILE_TITLE_MARGIN,
        direction: listDirections.COLUMN,
    });
};
