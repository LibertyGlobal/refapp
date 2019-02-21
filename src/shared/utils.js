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

function nop() {}

function secondsToMilliseconds(seconds) {
    return seconds * 1000;
}

function millisecondsToSeconds(milliseconds) {
    return milliseconds / 1000;
}

function minutesToSeconds(minutes) {
    return minutes * 60;
}
function debounce(func, delay) {
    let timeout;

    const debounced = function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };

    debounced.cancel = () => clearTimeout(timeout);
    debounced.cancelAndInvoke = (...args) => debounced.cancel() || func.apply(this, args);

    return debounced;
}

function delay(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

function getChannelLogo(channelNumber) {
    return null;
}

function groupByWith(data, propName, callBack) {
    return data.reduce((map, item) => {
        const key = item[propName];
        if (!key) {
            return map;
        }

        if (callBack) {
            callBack(item);
        }

        if (map.has(key)) {
            map.get(key).push(item);
        } else {
            map.set(key, [item]);
        }
        return map;
    }, new Map());
}

function generateId(prefix) {
    return i => `${prefix}-${i}`;
}

function throttleWithoutLastCall(func, ms) {
    let isThrottled = false;
    return function () {
        if (!isThrottled) {
            func.apply(this, arguments);
            isThrottled = true;
            setTimeout(() => {
                isThrottled = false;
            }, ms);
        }
    };
}

module.exports = {
    nop,
    secondsToMilliseconds,
    millisecondsToSeconds,
    minutesToSeconds,
    debounce,
    delay,
    getChannelLogo,
    groupByWith,
    generateId,
    throttleWithoutLastCall,
};
