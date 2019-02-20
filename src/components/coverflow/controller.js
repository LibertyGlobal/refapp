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

let vodScene = {};

if (typeof px !== 'undefined') {
    require('./coverflowtest_v2').init().then((scene) => {
        vodScene = scene;
    }).catch();
}


function show() {
    vodScene.a = 1;
}

function hide() {
    vodScene.a = 0;
}

function onKey({ keyCode, keyType }) {
    return global.coverflowKeyHandler({ keyCode, keyType });
}

module.exports = {
    show,
    hide,
    onKey,
};
