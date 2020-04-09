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

const logger = require('shared/logger');
const { Keys } = require('shared/constants');

const MODULE_NAME = 'shared/keyCodeMap';

let pxCodesToAppKeyCodes;

if (typeof px !== 'undefined') {
    px.import({
        keys: 'px:tools.keys.js',
    }).then(({ keys: pxKeys }) => {
        pxCodesToAppKeyCodes = {
            [pxKeys.LEFT]: Keys.Left,
            [pxKeys.UP]: Keys.Up,
            [pxKeys.RIGHT]: Keys.Right,
            [pxKeys.DOWN]: Keys.Down,
            [pxKeys.ENTER]: Keys.Enter,
            [pxKeys.I]: Keys.Info,
            [pxKeys.M]: Keys.Menu,
            [pxKeys.B]: Keys.Back,
            // several keys from Xiaomi remote come in as 0, at least now we have a BACK until there is a better fix
            [0]: Keys.Back, // eslint-disable-line
            [pxKeys.SPACE]: Keys.BackToTV,
            [pxKeys.HOME]: Keys.Menu,
            [pxKeys.END]: Keys.BackToTV,
            [pxKeys.F5]: Keys.BackToTV, // Xiaomi remote "mic" icon
            [pxKeys.T]: Keys.TeleText,
            [pxKeys.H]: Keys.Help,
            [pxKeys.D]: Keys.DVR,
            [pxKeys.O]: Keys.OnDemand,
            [pxKeys.R]: Keys.Record,
            [pxKeys.PERIOD]: Keys.FFWD, // >
            [pxKeys.COMMA]: Keys.RWND, // <
            [pxKeys.P]: Keys.PlayPause,
            [pxKeys.S]: Keys.Stop,
            [pxKeys.ESCAPE]: Keys.Power,
            [pxKeys.PAGEUP]: Keys.ChUp,
            [pxKeys.PAGEDOWN]: Keys.ChDown,
        };
    }).catch((e) => { logger.error(MODULE_NAME, 'mapping px:tools.keys.js', e); });
}

module.exports = (code) => {
    if (code >= 48 && code <= 57) {
        return code;
    }

    if (pxCodesToAppKeyCodes[code]) {
        return pxCodesToAppKeyCodes[code];
    }

    return null;
};
