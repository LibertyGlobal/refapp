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

const Keys = {
    Left: 131,
    Right: 132,
    Up: 129,
    Down: 130,
    Enter: 133,
    Info: 142,
    Menu: 192,
    Back: 149,
    ChUp: 136,
    ChDown: 137,
    UPC: 158,
    Mute: 140,
    VolumeUp: 138,
    VolumeDown: 139,
    BackToTV: 209,
    ContextMenu: 109,
    VoiceActivation: 100,
    Pairing: 239,
    TeleText: 96,
    Help: 161,
    DVR: 210,
    OnDemand: 211,
    Record: 156,
    FFWD: 152,
    RWND: 151,
    PlayPause: 155,
    RED: 148,
    BLUE: 147,
    GREEN: 159,
    YELLOW: 146,
    Stop: 154,
    Power: 128,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    0: 48,
};

const KeyPressTypes = {
    keyDown: 128,
    keyUp: 129,
    keyRepeat: 130,
};

const Events = {
    KEY_PRESSED: 'KEY_PRESSED',
};

const NumericKeyCodeMap = Array.from({ length: 10 }, (v, i) => i)
    .reduce((map, cur) => map.set(Keys[cur], cur), new Map());

const appWindowControllerKeys = {
    AWC: 'awc',
    COMCAST_AM: 'Comcast AM',
};

const listDirections = {
    ROW: 'row',
    COLUMN: 'column',
};

module.exports = {
    Keys,
    KeyPressTypes,
    Events,
    NumericKeyCodeMap,
    SCREEN_SIZE: {
        width: 1280,
        height: 720,
    },
    FONTS: {
        Icons: 'icons-regular',
        Text: 'regular',
    },
    listDirections,
    appWindowControllerKeys,
};
