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
const { SCREEN_SIZE } = require('shared/constants');
const components = require('./components');
const utils = require('shared/utils');
const logger = require('shared/logger');

const MODULE_NAME = 'ondemand/view';

const prerenderedNodeId = 'onDemand';
const onDemand = {
    id: '',
    node: null,
};

function render(model) {
    logger.log(MODULE_NAME, 'render');
    const onDemandComponent = components.onDemand(model);
    const recommendedTiles = onDemandComponent.getRecommendedTiles();
    const moviesCollection = onDemandComponent.getMoviesCollection();
    moviesCollection.root = onDemand;
    onDemand.id = onDemandComponent.id;

    model.bindWatcher('recommended', utils.nop);
    model.bindWatcher('movies', utils.nop);

    model.bindWatcher('recommendedActiveTile', (oldVal, newVal) => {
        if (model.get('activeSection') !== 'recommended') { return; }
        renderer.updateNode(recommendedTiles[oldVal].id, { border: components.TILE_INACTIVE_BORDER }, onDemand.node);
        renderer.updateNode(recommendedTiles[newVal].id, { border: components.TILE_ACTIVE_BORDER }, onDemand.node);
    });

    model.bindWatcher('moviesActiveTile', (oldVal, newVal) => {
        if (model.get('activeSection') !== 'movies') { return; }

        if (oldVal < newVal && newVal > 3) {
            moviesCollection
                .updateItem(oldVal, { styles: { border: components.TILE_INACTIVE_BORDER } })
                .move({ duration: 0.15, size: -240 })
                .updateItem(newVal, { styles: { border: components.TILE_ACTIVE_BORDER } });
        } else if (oldVal > newVal && newVal > 2) {
            moviesCollection
                .updateItem(oldVal, { styles: { border: components.TILE_INACTIVE_BORDER } })
                .move({ duration: 0.15, size: 240 })
                .updateItem(newVal, { styles: { border: components.TILE_ACTIVE_BORDER } });
        } else {
            moviesCollection
                .updateItem(oldVal, { styles: { border: components.TILE_INACTIVE_BORDER } })
                .updateItem(newVal, { styles: { border: components.TILE_ACTIVE_BORDER } });
        }
    });

    model.bindWatcher('activeSection', (oldVal, newVal) => {
        if (oldVal === 'recommended') {
            renderer.updateNode(
                recommendedTiles[model.get('recommendedActiveTile')].id,
                { border: components.TILE_INACTIVE_BORDER },
                onDemand.node
            );
            moviesCollection.updateItem(model.get('moviesActiveTile'), { styles: { border: components.TILE_ACTIVE_BORDER } });
        } else {
            moviesCollection.updateItem(model.get('moviesActiveTile'), { styles: { border: components.TILE_INACTIVE_BORDER } });
            renderer.updateNode(
                recommendedTiles[0].id,
                { border: components.TILE_ACTIVE_BORDER },
                onDemand.node
            );
        }
    });

    recommendedTiles[0].styles.border = components.TILE_ACTIVE_BORDER;
    onDemand.node = renderer.renderLayout(onDemandComponent);
    moviesCollection.generateList({
        elementsData: model.get('movies'),
        movable: true,
    });
}

function prerender() {
    renderer.renderLayout({
        id: prerenderedNodeId,
        styles: {
            width: SCREEN_SIZE.width,
            height: SCREEN_SIZE.height,
            background: '#222222',
        },
    });
}

function clean() {
    renderer.removeNode(onDemand.id);
    renderer.removeNode(prerenderedNodeId);
}


module.exports = {
    prerender,
    render,
    clean,
};
