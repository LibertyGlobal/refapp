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
const { listDirections } = require('shared/constants');
const { elementIdGetters } = require('./helpers');
const { StyleConstants } = require('./constants');
const list = require('renderer/list');
const tile = require('./subComponents/tile');

const rootId = 'apps';
const sectionTypes = [];
let viewNode;

function createSectionHeader(section, i) {
    return [
        {
            id: elementIdGetters.title(section.appsType),
            styles: {
                width: StyleConstants.SECTION_HEADER_WIDTH,
                height: StyleConstants.SECTION_HEADER_HEIGHT,
                fontSize: StyleConstants.SECTION_HEADER_FONT_SIZE,
                fontFamily: StyleConstants.APPS_FONT_FAMILY,
                fontColor: i === 0 ? StyleConstants.APPS_ACTIVE_COLOR : StyleConstants.APPS_INACTIVE_COLOR,
                text: section.appsType,
            },
        },
        {
            id: elementIdGetters.underline(section.appsType),
            styles: {
                width: StyleConstants.SECTION_UNDERLINE_WIDTH,
                height: StyleConstants.SECTION_UNDERLINE_HEIGHT,
                background: i === 0 ? StyleConstants.APPS_ACTIVE_COLOR : StyleConstants.APPS_INACTIVE_COLOR,
            },
        },
    ];
}

function createSection(section, i) {
    sectionTypes.push(section.appsType);
    return list({
        elements: [
            ...createSectionHeader(section, i),
            createAppList(section, i),
        ],
        elemMargin: StyleConstants.SECTION_HEADER_MARGIN,
        direction: listDirections.COLUMN,
        id: `section-${section.appsType}`,
    });
}

function createAppList(section, sectionIdx) {
    return list({
        elements: section.apps.map((app, i) => tile(app.logo, app.title, section.appsType, i, sectionIdx)),
        elemMargin: StyleConstants.TILE_MARGIN,
        direction: listDirections.ROW,
        id: `list-${section.appsType}`,
    });
}

function getLayout(model) {
    return {
        id: rootId,
        styles: {
            width: StyleConstants.APPS_WIDTH,
            height: StyleConstants.APPS_HEIGHT,
            background: StyleConstants.APPS_BG_COLOR,
        },
        children: [
            list({
                elements: model.appsData.map(createSection),
                elemMargin: StyleConstants.SECTION_MARGIN,
                direction: listDirections.COLUMN,
                styles: {
                    top: StyleConstants.GRID_CONTAINER_TOP,
                    left: StyleConstants.GRID_CONTAINER_LEFT,
                },
            }),
        ],
    };
}

function setUpWatchers(model) {
    model.bindWatcher('selectionCoordinates', (oldValue, newValue) => {
        const oldSection = oldValue[0];
        const oldTile = oldValue[1];
        const newSection = newValue[0];
        const newTile = newValue[1];

        const prevHeader = elementIdGetters.title(sectionTypes[oldSection]);
        const prevUnderline = elementIdGetters.underline(sectionTypes[oldSection]);
        const curHeader = elementIdGetters.title(sectionTypes[newSection]);
        const curUnderline = elementIdGetters.underline(sectionTypes[newSection]);

        const prevTileTitle = elementIdGetters.tileTitle(sectionTypes[oldSection], oldTile);
        const curTileTitle = elementIdGetters.tileTitle(sectionTypes[newSection], newTile);
        const prevTileLogo = elementIdGetters.tileLogo(sectionTypes[oldSection], oldTile);
        const curTileLogo = elementIdGetters.tileLogo(sectionTypes[newSection], newTile);

        renderer.updateNode(prevHeader, { fontColor: StyleConstants.APPS_INACTIVE_COLOR }, viewNode);
        renderer.updateNode(prevUnderline, { background: StyleConstants.APPS_INACTIVE_COLOR }, viewNode);
        renderer.updateNode(curHeader, { fontColor: StyleConstants.APPS_ACTIVE_COLOR }, viewNode);
        renderer.updateNode(curUnderline, { background: StyleConstants.APPS_ACTIVE_COLOR }, viewNode);

        renderer.updateNode(prevTileTitle, { fontColor: StyleConstants.APPS_INACTIVE_COLOR }, viewNode);
        renderer.updateNode(curTileTitle, { fontColor: StyleConstants.APPS_ACTIVE_COLOR }, viewNode);
        renderer.updateNode(prevTileLogo, { border: StyleConstants.TILE_LOGO_INACTIVE_BORDER }, viewNode);
        renderer.updateNode(curTileLogo, { border: StyleConstants.TILE_LOGO_ACTIVE_BORDER }, viewNode);
    });
}

function clear() {
    renderer.removeNode(rootId);
}

function render(model) {
    setUpWatchers(model);
    viewNode = renderer.renderLayout(getLayout(model));
}

module.exports = { render, clear };
