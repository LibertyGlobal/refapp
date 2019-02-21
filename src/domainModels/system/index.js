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

const time = require('cache/config');
const eventEmitter = require('shared/eventEmitter');

const TIME_UPDATE_INTERVAL = 1000;

let currentTime = time.now;
const handlers = new Map();

setInterval(() => {
    currentTime++;
    fireByTime(currentTime);
}, TIME_UPDATE_INTERVAL);

function setSystemInterval(time, handler, relative = true) {

    const timeToSubscribe = Math.max(time, 1);

    if (!handlers.has(handler)) {
        if (relative) {
            handlers.set(handler, (() => {
                let internalTimer = 0;
                return () => {
                    internalTimer++;
                    return internalTimer % timeToSubscribe === 0;
                };
            })());
        } else {
            handlers.set(handler, (time) => {
                return time % timeToSubscribe === 0;
            });
        }
    }
}

function clearSystemInterval(handler) {
    if (handlers.has(handler)) {
        handlers.delete(handler);
    }
}

function getNow() {
    return currentTime;
}

function fireByTime(time) {

    handlers.forEach((condition, handler) => {
        if (condition(time)) {
            handler(time);
        }
    });
}

module.exports = {
    setSystemInterval,
    clearSystemInterval,
    getNow,
    eventEmitter,
};
