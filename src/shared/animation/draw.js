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

const LgireAnimation = require('lgire').Animation;
const { states } = require('./constants');

function update(node, { moveX, moveY, width, height, opacity }) {

    if (moveX || moveY) {
        node.setPositionRelative(~~moveX, ~~moveY, true);
    }

    if (width - node.animOptions.initialStyles.width) {
        node.setWidth(width);
    }

    if (height - node.animOptions.initialStyles.height) {
        node.setHeight(height);
    }

    if (opacity - node.animOptions.initialStyles.opacity) {
        node.setOpacity(opacity);
    }

}

module.exports = function draw(node, state) {

    if (!node.animOptions) {
        return;
    }

    let newProps;

    const width = node.animOptions.newStyles.width;
    const height = node.animOptions.newStyles.height;
    const opacity = node.animOptions.newStyles.opacity;

    const initialWidth = node.animOptions.initialStyles.width;
    const initialHeight = node.animOptions.initialStyles.height;
    const initialOpacity = node.animOptions.initialStyles.opacity;

    if (state < states.FIRST_POINT && node.animOptions.timingFunction) {

        node.markMoving(states.FIRST_POINT);

        const alpha = LgireAnimation.posMapN(state, node.animOptions.timingFunction.type, node.animOptions.timingFunction.points);

        newProps = {
            width: Math.round((alpha * (width - initialWidth)) + initialWidth),
            height: Math.round((alpha * (height - initialHeight)) + initialHeight),
            opacity: Math.round((alpha * (opacity - initialOpacity)) + initialOpacity),
        };

        if (node.animOptions.xDistance) {
            const newPosX = Math.floor(alpha * node.animOptions.xDistance);
            newProps.moveX = newPosX - node.animOptions.oldPosition.X;
            node.animOptions.oldPosition.X = newPosX;
        }

        if (node.animOptions.yDistance) {
            const newPosY = Math.floor(alpha * node.animOptions.yDistance);
            newProps.moveY = newPosY - node.animOptions.oldPosition.Y;
            node.animOptions.oldPosition.Y = newPosY;
        }
    } else {
        node.markMoving(states.SECOND_POINT);

        newProps = {
            width,
            height,
            opacity,
        };

        if (node.animOptions.xDistance) {
            newProps.moveX = node.animOptions.xDistance - node.animOptions.oldPosition.X;
        }

        if (node.animOptions.yDistance) {
            newProps.moveY = node.animOptions.yDistance - node.animOptions.oldPosition.Y;
        }

        node.markMoving(states.END_POINT);
    }

    update(node, newProps);

};
