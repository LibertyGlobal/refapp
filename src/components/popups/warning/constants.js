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

const UNEXPECTED_WARNING_CODE = '1000';

const CONTAINER = {
    width: 600,
    height: 230,
    top: ((SCREEN_SIZE.height / 2) - (250 / 2)),
    left: ((SCREEN_SIZE.width / 2) - (600 / 2)),
    padding: 20,
    borderWidth: 1,
};

const HEADER = {
    height: Math.ceil((CONTAINER.height / 3) - CONTAINER.padding),
    top: CONTAINER.padding,
    left: CONTAINER.padding,
    width: CONTAINER.width - (2 * CONTAINER.padding),
};

const BODY = {
    height: CONTAINER.height - HEADER.height - (2 * CONTAINER.padding) - 40,
    top: HEADER.height + CONTAINER.padding + 40,
    left: HEADER.left,
    width: HEADER.width,
};

const WARNING_ICON = {
    width: 70,
    height: HEADER.height,
};

const FONT_SIZE = {
    title: 30,
    code: 30,
    content: 25,
};

module.exports = {
    UNEXPECTED_WARNING_CODE,
    styleConstants: {
        CONTAINER,
        HEADER,
        BODY,
        WARNING_ICON,
        FONT_SIZE,
    },
};

