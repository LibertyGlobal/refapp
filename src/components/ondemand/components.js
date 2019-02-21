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

const list = require('renderer/list');
const DynamicList = require('shared/DynamicList');
const { FONTS, SCREEN_SIZE, listDirections } = require('shared/constants');
const path = require('path');
const logger = require('shared/logger'); // eslint-disable-line

const MODULE_NAME = 'ondemand/components'; // eslint-disable-line

let tileIdCounter = 0;

const RECOMMENDED_MARGIN = 20;
const MOVIES_MARGIN = 10;
const RECOMMENDED_TILE_HEIGHT = 200;
const RECOMMENDED_TILE_WIDTH = 350;
const MOVIE_TILE_HEIGHT = 130;
const MOVIE_TILE_WIDTH = 230;

const SECTION_HEADER_HEIGHT = 50;
const SECTION_HEADER_WIDTH = 500;
const SECTION_HEADER_FONTSIZE = 30;

const CONTAINER_TOP = 100;
const CONTAINER_LEFT = 100;

const ACTIVE_COLOR = '#3489cd';
const TILE_INACTIVE_BORDER = [0, 0, 0, 0, 'out'];
const TILE_ACTIVE_BORDER = [5, 5, 5, 5, 'out'];
const TILE_TITLE_HEIGHT = 20;
const TILE_TITLE_FONTSIZE = 18;
const TILE_TITLE_MARGIN = 10;

const tile = ({ width, height, id = `ondemandTile-${tileIdCounter++}`, title, url }) => ({
    id,
    styles: {
        width,
        height,
        backgroundImage: path.join(__dirname, '../../img/movies/', url),
        border: TILE_INACTIVE_BORDER,
        borderColor: ACTIVE_COLOR,
    },
    children: [
        {
            id: `${id}-fading`,
            styles: {
                background: 'rgba(0,0,0,0.5)',
                width,
                height,
            },
        },
        {
            id: `${id}-title`,
            styles: {
                width,
                height: TILE_TITLE_HEIGHT,
                top: height - TILE_TITLE_HEIGHT - TILE_TITLE_MARGIN,
                fontSize: TILE_TITLE_FONTSIZE,
                fontFamily: FONTS.Text,
                textAlign: 'center',
                align: 'center',
                fontColor: '#ffffff',
                text: title,
            },
        },
    ],
});

const recommendedCollection = model => list({
    elements: model.get('recommended')
        .map(({ title, url }) => tile({ width: RECOMMENDED_TILE_WIDTH, height: RECOMMENDED_TILE_HEIGHT, title, url })),
    elemMargin: RECOMMENDED_MARGIN,
});

function moviesItemGenerator(itemData, preItem) {
    const { title, url } = itemData;
    const prevItemStyles = preItem && preItem.styles;
    const basicItem = tile({ width: MOVIE_TILE_WIDTH, height: MOVIE_TILE_HEIGHT, title, id: '', url });
    basicItem.styles.left = prevItemStyles ? prevItemStyles.left + prevItemStyles.width + MOVIES_MARGIN : 0;
    return basicItem;
}

let moviesCollection;

const sectionHeader = (model, id, text) => ({
    id,
    styles: {
        width: SECTION_HEADER_WIDTH,
        height: SECTION_HEADER_HEIGHT,
        fontSize: SECTION_HEADER_FONTSIZE,
        fontFamily: FONTS.Text,
        fontColor: '#ffffff',
        text,
    },
});

const recommededSection = model => list({
    direction: listDirections.COLUMN,
    elements: [
        sectionHeader(model, 'recommended-header', 'Recommended'),
        recommendedCollection(model),
    ],
    elemMargin: 30,
});

const moviesSection = (model) => {
    moviesCollection = new DynamicList({
        id: 'moviesCollection',
        listItemGenerator: moviesItemGenerator,
        styles: {
            width: SCREEN_SIZE.width - CONTAINER_LEFT,
            height: TILE_TITLE_HEIGHT,
        },
    });
    return list({
        direction: listDirections.COLUMN,
        elements: [
            sectionHeader(model, 'movies-header', 'All movies'),
            moviesCollection.list,
        ],
        elemMargin: 20,
    });
};

function getRecommendedTiles() {
    return this.children[0].children[1].children;
}

const onDemand = (model) => {
    const component = list({
        styles: {
            top: CONTAINER_TOP,
            left: CONTAINER_LEFT,
        },
        direction: listDirections.COLUMN,
        elements: [
            recommededSection(model),
            moviesSection(model),
        ],
        elemMargin: 80,
    });

    component.getRecommendedTiles = getRecommendedTiles;
    component.getMoviesCollection = () => moviesCollection;

    return component;
};

module.exports = {
    recommendedCollection,
    moviesCollection,
    sectionHeader,
    onDemand,
    ACTIVE_COLOR,
    TILE_INACTIVE_BORDER,
    TILE_ACTIVE_BORDER,
};
