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

const renderer = require('renderer');
const { SCREEN_SIZE, FONTS, listDirections } = require('shared/constants');
const list = require('renderer/list');
const path = require('path');
const logger = require('shared/logger'); // eslint-disable-line

const moduleName = 'detailPage/view'; // eslint-disable-line

const rootNodeId = 'DetailPage';

const CONTAINER_LEFT = 200;
const CONTAINER_TOP = 200;
const POSTER_LEFT = 700;
const POSTER_TOP = CONTAINER_TOP;
const POSTER_WIDTH = 180;
const POSTER_HEIGHT = 240;
const PRIMARY_FONTSIZE = 40;
const PRIMARY_HEIGHT = 50;
const SECONDARY_FONTSIZE = 35;
const SECONDARY_HEIGHT = 40;
const DESC_FONTSIZE = 25;
const DECS_HEIGHT = 30;
const TEXT_MARGIN = 50;
const TEXT_WIDTH = 500;

const fontStyles = {
    fontFamily: FONTS.Text,
    fontColor: '#ffffff',
};

function getLayout(model) {
    return {
        id: rootNodeId,
        styles: {
            width: SCREEN_SIZE.width,
            height: SCREEN_SIZE.height,
            background: '#222222',
        },
        children: [
            {
                id: 'dp-entity-poster',
                styles: {
                    left: POSTER_LEFT,
                    top: POSTER_TOP,
                    width: POSTER_WIDTH,
                    height: POSTER_HEIGHT,
                    backgroundImage: path.join(__dirname, '../../img/posters/', model.entity.poster),
                },
            },
            list({
                styles: { left: CONTAINER_LEFT, top: CONTAINER_TOP },
                elemMargin: TEXT_MARGIN,
                direction: listDirections.COLUMN,
                elements: [
                    {
                        id: 'dp-entity-title',
                        styles: Object.assign(
                            {},
                            fontStyles,
                            {
                                width: TEXT_WIDTH,
                                height: PRIMARY_HEIGHT,
                                fontSize: PRIMARY_FONTSIZE,
                                text: `${model.get('title')} (${model.get('year')})`,
                            }
                        ),
                    },
                    {
                        id: 'dp-entity-rating',
                        styles: Object.assign(
                            {},
                            fontStyles,
                            {
                                width: TEXT_WIDTH,
                                height: SECONDARY_HEIGHT,
                                fontSize: SECONDARY_FONTSIZE,
                                text: `Rating: ${model.get('starRating')}`,
                            }
                        ),
                    },
                    {
                        id: 'dp-entity-description',
                        styles: Object.assign(
                            {},
                            fontStyles,
                            {
                                width: TEXT_WIDTH,
                                height: DECS_HEIGHT,
                                fontSize: DESC_FONTSIZE,
                                text: model.get('mediumSynopsis'),
                            }
                        ),
                    },
                ],
            }),
        ],
    };
}

function render(model) {
    renderer.renderLayout(getLayout(model));
}

function clear() {
    renderer.removeNode(rootNodeId);
}

module.exports = {
    clear,
    render,
};
