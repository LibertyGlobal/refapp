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

const { ZapDirections } = require('./constants');

function getNextChannel(channels, currentChannel) {
    const currentIndex = channels.indexOf(currentChannel);

    return currentIndex + 1 > channels.length - 1 ? channels[0] : channels[currentIndex + 1];
}

function getPrevChannel(channels, currentChannel) {
    const currentIndex = channels.indexOf(currentChannel);

    return currentIndex - 1 < 0 ? channels[channels.length - 1] : channels[currentIndex - 1];
}

function getChannelToZap(direction, channels, currentChannel) {
    return direction === ZapDirections.FORWARD
        ? getNextChannel(channels, currentChannel)
        : getPrevChannel(channels, currentChannel);
}

function getNearestChannelIndex(channels, channelNumber) {
    const channelNumberToFind = ~~channelNumber;

    for (let index = 0; index < channels.length; index++) {
        const currentChannelNumber = ~~channels[index].channelIndex;

        if (currentChannelNumber >= channelNumberToFind) {
            if (index === 0) {
                return 0;
            }

            const distanceAfter = currentChannelNumber - channelNumberToFind;
            const distanceBefore = channelNumberToFind - channels[index - 1].channelIndex;

            if (distanceAfter <= distanceBefore) {
                return index;
            }

            return index - 1;
        }
    }

    return channels.length - 1;
}

function getChannelOrNearestByLcn(channels, lcn) {
    const channel = channels.find(channel => channel.channelIndex === lcn);

    return channel || channels[getNearestChannelIndex(channels, lcn)];
}

module.exports = {
    getNextChannel,
    getPrevChannel,
    getChannelToZap,
    getChannelOrNearestByLcn,
    getNearestChannelIndex,
};
