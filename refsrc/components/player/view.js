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
const { StyleConstants } = require('./constants');
const logger = require('shared/logger');

const rootId = 'player';
let viewNode;

function getLayout(model) {
    return {
        id: rootId,
        styles: {
            width: StyleConstants.PLAYER_WIDTH,
            height: StyleConstants.PLAYER_HEIGHT,
            top: StyleConstants.PLAYER_TOP,
            left: StyleConstants.PLAYER_LEFT,
            backgroundImage: StyleConstants.PLAYER_GRADIENT,
        },
        children: [
            {
                id: 'assetTitle',
                styles: {
                    width: StyleConstants.ASSET_TITLE_WIDTH,
                    height: StyleConstants.ASSET_TITLE_HEIGHT,
                    top: StyleConstants.ASSET_TITLE_TOP,
                    left: StyleConstants.ASSET_TITLE_LEFT,
                    fontColor: StyleConstants.PLAYER_FONT_COLOR,
                    fontFamily: StyleConstants.PLAYER_FONT,
                    fontSize: StyleConstants.ASSET_TITLE_FONT_SIZE,
                    text: model.title,
                },
            },
            {
                id: 'playerProgressBarBg',
                styles: {
                    width: StyleConstants.PLAYER_PROGRESS_BAR_WIDTH,
                    height: StyleConstants.PLAYER_PROGRESS_BAR_HEIGHT,
                    background: StyleConstants.PLAYER_PROGRESS_BAR_BG_COLOR,
                    top: StyleConstants.PLAYER_PROGRESS_BAR_TOP,
                    left: StyleConstants.PLAYER_PROGRESS_BAR_LEFT,
                },
                children: [
                    {
                        id: 'playerProgressBar',
                        styles: {
                            width: model.get('progressBarWidth'),
                            height: StyleConstants.PLAYER_PROGRESS_BAR_HEIGHT,
                            background: StyleConstants.PLAYER_PROGRESS_BAR_COLOR,
                        },
                    },
                ],
            },
            {
                id: 'trickPlayCircle',
                styles: {
                    width: StyleConstants.TRICKPLAY_ICON_SIZE,
                    height: StyleConstants.TRICKPLAY_ICON_SIZE,
                    top: StyleConstants.TRICKPLAY_ICON_TOP,
                    left: model.get('trickPlayIconPosition'),
                    backgroundImage: StyleConstants.TRICKPLAY_CIRCLE,
                },
            },
            {
                id: 'timeProgress',
                styles: {
                    width: StyleConstants.TIME_PROGRESS_WIDTH,
                    height: StyleConstants.TIME_PROGRESS_HEIGHT,
                    top: StyleConstants.TIME_PROGRESS_TOP,
                    left: StyleConstants.TIME_PROGRESS_LEFT,
                    fontFamily: StyleConstants.TIME_PROGRESS_FONT,
                    fontColor: StyleConstants.TIME_PROGRESS_FONT_COLOR,
                    fontSize: StyleConstants.TIME_PROGRESS_FONT_SIZE,
                    text: model.get('currentTimeProgress'),
                    'text-align': 'left',
                },
            },
        ],
    };
}

function setUpWatchers(model) {
    model.bindWatcher('currentTimeProgress', (oldValue, newValue) => {
        renderer.updateNode('timeProgress', { text: newValue }, viewNode);
    });

    model.bindWatcher('progressBarWidth', (oldValue, newValue) => {
        renderer.updateNode('playerProgressBar', { width: newValue }, viewNode);
    });

    model.bindWatcher('trickPlayIconPosition', (oldValue, newValue) => {
        renderer.updateNode('trickPlayCircle', { left: newValue }, viewNode);
    });
    model.bindWatcher('visibility', (oldValue, newValue) => {
        logger.log('player/view', 'change visibility', newValue);
        viewNode.setVisible(newValue);
    });
}

function render(model) {
    setUpWatchers(model);
    viewNode = renderer.renderLayout(getLayout(model));
}

function clear() {
    renderer.removeNode(rootId);
}

module.exports = {
    render,
    clear,
};
