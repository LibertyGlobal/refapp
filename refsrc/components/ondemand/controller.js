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

const view = require('./view');
const model = require('./model');
const { Keys, KeyPressTypes } = require('shared/constants');
const { getOnDemandMovies, getRecommendedMovies } = require('domainModels/ondemand');
const logger = require('shared/logger');
const { go, paths } = require('navigation');
const player = require('domainModels/player');
const channelDomainModel = require('domainModels/channel');

const moduleName = 'ondemand';

function show() {
    getRecommendedMovies()
        .then((recommendedData) => {
            model.set('recommended', recommendedData);
            model.set('movies', getOnDemandMovies());
            view.render(model);
        })
        .catch(err => logger.error('Ondemand controller', 'show', err));
    view.prerender();
}

function hide() {
    model.set('activeSection', 'recommended');
    model.set('recommendedActiveTile', 0);
    model.set('moviesActiveTile', 0);
    view.clean();
}

function handleTileNavigation(keyCode) {
    const activeSection = model.get('activeSection');

    const nextIndex = keyCode === Keys.Left
        ? Math.max(
            model.get(`${activeSection}ActiveTile`) - 1,
            0
        )
        : Math.min(
            model.get(`${activeSection}ActiveTile`) + 1,
            activeSection === 'recommended'
                ? model.get('recommended').length - 1
                : model.get('movies').length - 1
        );

    model.set(`${activeSection}ActiveTile`, nextIndex);
    model.updateView();
}

function handleSectionNavigation() {
    model.set(
        'activeSection',
        model.get('activeSection') === 'recommended'
            ? 'movies' : 'recommended'
    );
    model.updateView();
    model.set('recommendedActiveTile', 0);
}

function getFocusedEntity() {
    const activeSection = model.get('activeSection');
    return model.get(activeSection)[model.get(`${activeSection}ActiveTile`)];
}

function playIPPlayBack(initialKey) {
    player.playIP(getFocusedEntity())
        .then(() => {
            logger.log(moduleName, 'playIP', 'go to player');
            go(paths.player, initialKey);
        })
        .catch((e) => { logger.log(moduleName, 'playIP', `${e}`); });
}

function onKey({ keyCode, keyType }) {
    if (keyType !== KeyPressTypes.keyDown) { return false; }

    switch (keyCode) {
        case Keys.Back:
        case Keys.BackToTV:
            channelDomainModel.setCurrentChannel(channelDomainModel.getCurrentChannel())
                .then(() => go(paths.channelBar))
                .catch(err => logger.error(moduleName, 'BackToTV & Back', err));
            return true;
        case Keys.Menu:
            channelDomainModel.setCurrentChannel(channelDomainModel.getCurrentChannel())
                .then(() => go(paths.mainMenu))
                .catch(err => logger.error(moduleName, 'Menu key', err));
            return true;
        case Keys.Left:
        case Keys.Right:
            handleTileNavigation(keyCode);
            return true;
        case Keys.Down:
        case Keys.Up:
            handleSectionNavigation();
            return true;
        case Keys.Enter:
            go(paths.detailPage, getFocusedEntity());
            return true;
        case Keys.PlayPause:
            playIPPlayBack(Keys.PlayPause);
            return true;
        default:
            return false;
    }
}

module.exports = {
    show,
    hide,
    onKey,
    name: 'On Demand',
};
