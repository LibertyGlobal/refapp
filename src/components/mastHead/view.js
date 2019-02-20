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
const { renderLayout, removeNode, updateNode } = require('renderer');
const { StyleConstants } = require('./constants');

const rootNodeId = 'mastHead';

function render(model) {

    let viewNode;

    model.bindWatcher('time', (oldValue, newValue) => {
        updateNode('mastHeadClock', {
            text: newValue,
        }, viewNode);
    });

    const nodes = {
        id: rootNodeId,
        styles: {
            width: StyleConstants.MAST_HEAD_WIDTH,
            height: StyleConstants.MAST_HEAD_HEIGHT,
            backgroundImage: StyleConstants.MAST_HEAD_BG_IMG,
        },
        children: [
            {
                id: 'currentView',
                styles: {
                    width: StyleConstants.ITEM_WIDTH,
                    height: StyleConstants.ITEM_HEIGHT,
                    top: StyleConstants.MAST_HEAD_TOP,
                    textValign: 'middle',
                    textAlign: 'center',
                    fontColor: '#fefefe',
                    lineHeight: StyleConstants.ITEM_HEIGHT,
                    fontSize: StyleConstants.FONT_SIZE,
                    text: model.openedViewName,
                },
            },
            {
                id: 'rdkLogo',
                styles: {
                    width: StyleConstants.LOGO_WIDTH,
                    height: StyleConstants.LOGO_HEIGHT,
                    top: StyleConstants.MAST_HEAD_TOP,
                    left: StyleConstants.LOGO_LEFT,
                    backgroundImage: path.join(__dirname, '../../img/rdk-logo.png'),
                },
            },
            {
                id: 'mastHeadClock',
                styles: {
                    width: StyleConstants.ITEM_WIDTH,
                    left: StyleConstants.MAST_HEAD_WIDTH - StyleConstants.ITEM_WIDTH,
                    height: StyleConstants.ITEM_HEIGHT,
                    top: StyleConstants.MAST_HEAD_TOP,
                    textValign: 'middle',
                    textAlign: 'center',
                    fontColor: '#fefefe',
                    lineHeight: StyleConstants.ITEM_HEIGHT,
                    fontSize: StyleConstants.FONT_SIZE,
                    text: model.get('time'),
                },
            },
        ],
    };

    viewNode = renderLayout(nodes);
}

function clean() {
    removeNode(rootNodeId);
}

module.exports = {
    render,
    clean,
};
