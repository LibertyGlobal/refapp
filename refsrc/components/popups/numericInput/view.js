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
const { FONTS } = require('shared/constants');

const rootNodeId = 'numericInput';

function getLayout(model) {
    return {
        id: rootNodeId,
        styles: {
            width: 70,
            height: 50,
            left: 100,
            top: 500,
            background: '#3489cd',
            fontSize: 25,
            fontFamily: FONTS.Text,
            fontColor: '#ffffff',
            lineHeight: 50,
            textAlign: 'center',
            textValign: 'center',
            text: model.get('inputValue'),
        },
    };
}

function render(model) {
    model.bindWatcher('inputValue', (oldValue, newValue) => {
        renderer.updateNode(rootNodeId, { text: newValue });
    });

    renderer.renderLayout(getLayout(model));
}

function clear() {
    renderer.removeNode(rootNodeId);
}


module.exports = { render, clear };
