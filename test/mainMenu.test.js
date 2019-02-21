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

const { model } = require('components/mainMenu/model');
const controller = require('components/mainMenu/controller');
const { Keys, KeyPressTypes } = require('shared/constants');

const tree = controller.show(model);

test('should render correctly', () => {
    expect(tree.toPretty()).toMatchSnapshot();
});

test('should handle Right key and navigate right', () => {
    controller.onKey({ keyCode: Keys.Right, keyType: KeyPressTypes.keyDown });
    expect(tree.toPretty()).toMatchSnapshot();
});

test('should handle Left key and navigate left', () => {
    controller.onKey({ keyCode: Keys.Left, keyType: KeyPressTypes.keyDown });
    expect(tree.toPretty()).toMatchSnapshot();
});
