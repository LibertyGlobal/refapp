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
const ViewModel = require('shared/ViewModel');
const { groupByWith } = require('shared/utils');
const apps = require('cache/apps.json');

const appsData = [];
groupByWith(apps, 'appType', (item) => {
    const { logo } = item;
    item.logo = path.resolve(__dirname, `../../cache/appsLogos/${logo}`);
}).forEach((value, key) => {
    appsData.push({
        appsType: key,
        apps: value,
    });
});

const model = new ViewModel({ appsData });

model.set('selectionCoordinates', [0, 0]);

function navigate(direction, curIndex, length) {
    return direction === 'forward'
        ? Math.min(curIndex + 1, length - 1)
        : Math.max(curIndex - 1, 0);
}

function changeActiveSection(direction) {
    const sections = model.appsData;
    const [selectedSection, selectedTile] = model.get('selectionCoordinates');
    const nextSection = navigate(direction, selectedSection, sections.length);
    const tiles = model.appsData.find((section, i) => nextSection === i).apps;
    const nextTile = Math.min(selectedTile, tiles.length - 1);

    model.set('selectionCoordinates', [nextSection, nextTile]);
}

function changeActiveTile(direction) {
    const curCoords = model.get('selectionCoordinates');
    const selectedSection = curCoords[0];
    const selectedTile = curCoords[1];
    const tiles = model.appsData.find((section, i) => selectedSection === i).apps;
    const nextTile = navigate(direction, selectedTile, tiles.length);

    model.set('selectionCoordinates', [selectedSection, nextTile]);
}

function getActiveTile() {
    const [selectedSection, selectedTile] = model.get('selectionCoordinates');
    const tiles = model.appsData.find((section, i) => selectedSection === i).apps;
    return tiles[selectedTile];
}

module.exports = {
    model,
    changeActiveSection,
    changeActiveTile,
    getActiveTile,
};
