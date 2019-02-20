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
const draw = require('./draw');
const { states, timingFunctions } = require('./constants');

function animationCbFactory(node) {
    return function (state) {

        draw(node, state);

        if (state >= states.FIRST_POINT) {
            delete node.animOptions;
            return false;
        }

        return true;
    };
}

function mixOptionsForAnimatedNode(node, options, animationCb) {

    const initialStyles = {
        width: node.getWidth(),
        height: node.getHeight(),
        opacity: node.getOpacity(),
    };

    node.animOptions = Object.assign({}, options, {
        initialStyles,
        newStyles: Object.assign({}, options.newStyles, initialStyles),
        oldPosition: {
            X: 0,
            Y: 0,
        },
        forseStop: false,
        animationCb,
    });

    node.markMoving(states.INIT_POINT);
}

function animate(node, options) {

    if (node && options && options.duration !== undefined) {

        const animationCbForNode = animationCbFactory(node);

        cancel(node);
        mixOptionsForAnimatedNode(node, options, animationCbForNode);

        if (options.duration === 0) {
            animationCbForNode(states.FIRST_POINT);
        } else {
            LgireAnimation.addTimeline(options.duration, animationCbForNode);
        }
    }
}

function cancel(node) {
    if (node && node.animOptions) {
        node.animOptions.animationCb(states.FIRST_POINT);
        return true;
    }
    return false;
}

module.exports = {
    timingFunctions,
    animate,
    cancel,
};
