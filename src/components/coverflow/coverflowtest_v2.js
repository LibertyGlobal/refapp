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

const pathToScene = path.resolve(__dirname, './coverflow_v2.js');


function init() {
    return px.import("px:scene.1.js").then( function ready(scene) {
        var root = scene.root;
        root.h = 1000;
        var basePackageUri = px.getPackageBaseFilePath();
        var s = scene.create({t:"scene",a:0,parent:root,w:1280,h:720,url:pathToScene});
        s.focus = true;

        return s;
    });
}

module.exports = { init };

