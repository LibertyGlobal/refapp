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
const { renderLayout, removeNode } = require('renderer');
const { FONTS } = require('shared/constants');
const { styleConstants } = require('./constants');

const {
    CONTAINER,
    HEADER,
    BODY,
    WARNING_ICON,
    FONT_SIZE,
} = styleConstants;

const rootNodeId = 'warningPopup';

function render(model) {
    renderLayout({
        id: rootNodeId,
        styles: {
            width: CONTAINER.width,
            height: CONTAINER.height,
            left: CONTAINER.left,
            top: CONTAINER.top,
            background: '#000000',
            border: [CONTAINER.borderWidth, CONTAINER.borderWidth, CONTAINER.borderWidth, CONTAINER.borderWidth, 'in'],
            borderColor: '#cccccc',
            padding: [0, 0, 0, CONTAINER.padding],
        },
        children: [
            {
                id: 'warningPopup-header',
                styles: {
                    width: HEADER.width,
                    height: HEADER.height,
                    top: HEADER.top,
                    left: HEADER.left,
                },
                children: [
                    {
                        id: 'warningPopup-header-icon',
                        styles: {
                            width: WARNING_ICON.width,
                            height: WARNING_ICON.height,
                            backgroundImage: path.join(__dirname, './assets/icWarning.png'),
                        },
                    },
                    {
                        id: 'warningPopup-header-title',
                        styles: {
                            width: HEADER.width,
                            height: HEADER.height,
                            fontSize: FONT_SIZE.title,
                            fontFamily: FONTS.Text,
                            fontColor: '#ffffff',
                            lineHeight: HEADER.height,
                            textAlign: 'center',
                            textValign: 'center',
                            text: model.title,
                        },
                    },
                ],
            },
            {
                id: 'warningPopup-body',
                styles: {
                    width: BODY.width,
                    height: BODY.height,
                    top: BODY.top,
                    left: BODY.left,
                    fontSize: FONT_SIZE.content,
                    fontFamily: FONTS.Text,
                    fontColor: '#ffffff',
                    lineHeight: FONT_SIZE.content,
                    textAlign: 'center',
                    textValign: 'center',
                    text: model.content,
                    wordWrap: true,
                },
            },
        ],
    });
}

function clear() {
    removeNode(rootNodeId);
}


module.exports = { render, clear };
