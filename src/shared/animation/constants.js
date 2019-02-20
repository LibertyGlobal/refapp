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

const LgireAnimation = require('lgire').Animation;

module.exports = {
    timingFunctions: {
        LINEAR: {
            type: LgireAnimation.POS_MAP_LINEAR,
            points: [0, 0, 0, 0],
        },
    },
    states: {
        INIT_POINT: 0,
        FIRST_POINT: 1,
        SECOND_POINT: 2,
        END_POINT: 3,
    },
};
