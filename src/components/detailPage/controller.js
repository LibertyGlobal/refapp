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
const { model, initModel } = require('./model');
const { Keys, KeyPressTypes } = require('shared/constants');
const { go, paths } = require('navigation');
const player = require('domainModels/player');
const logger = require('shared/logger'); // eslint-disable-line
const channelDomainModel = require('domainModels/channel');

const moduleName = 'detailPage'; // eslint-disable-line

function show(entity) {
    initModel(entity);
    view.render(model);
}

function hide() {
    view.clear();
}

function onKey({ keyCode, keyType }) {
    let used = false;
    if (keyType !== KeyPressTypes.keyDown) {
        return used;
    }

    switch (keyCode) {
        case Keys.Back:
            go(paths.onDemand);
            used = true;
            break;
        case Keys.BackToTV:
            channelDomainModel.setCurrentChannel(channelDomainModel.getCurrentChannel())
                .then(() => go(paths.channelBar))
                .catch(err => logger.error(moduleName, 'BackToTV & Back', err));
            used = true;
            break;
        case Keys.Menu:
            channelDomainModel.setCurrentChannel(channelDomainModel.getCurrentChannel())
                .then(() => go(paths.mainMenu))
                .catch(err => logger.error(moduleName, 'Menu key', err));
            used = true;
            break;
        case Keys.Enter:
        case Keys.PlayPause:
            used = true;
            logger.log(moduleName, 'onKeyEnter', model.entity.title);
            player.playIP(model.entity)
                .then(() => {
                    logger.log(moduleName, 'playIP', 'go to player');
                    go(paths.player, Keys.PlayPause);
                })
                .catch((e) => { logger.log(moduleName, 'playIP', `${e}`); });
            break;
        default:
    }

    return used;
}

module.exports = {
    show,
    hide,
    onKey,
    name: 'Detail Page',
};
