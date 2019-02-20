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
const { StyleConstants } = require('./constants');
const { FONTS } = require('shared/constants');
const { secondsToMilliseconds } = require('shared/utils');
const { getNow } = require('domainModels/system');
const path = require('path');

const rootNodeId = 'channelBar';

function getTimeSpan(startTime, endTime) {
    const start = new Date(secondsToMilliseconds(startTime)).toTimeString().slice(0, 5);
    const end = new Date(secondsToMilliseconds(endTime)).toTimeString().slice(0, 5);
    return `${start} - ${end}`;
}

function calculateProgressBarWidth(start, end) {
    const now = getNow();
    const progress = (now - start) / (end - start);

    return Math.round(progress * StyleConstants.EPG_INFO_PROGRESS_BAR_WIDTH);
}


function getLayout(model) {
    const { channelNumber, logo } = model.get('channel');
    const { startTime, endTime, title } = model.get('currentEvent');
    return {
        id: rootNodeId,
        styles: {
            width: StyleConstants.CB_WIDTH,
            height: StyleConstants.CB_HEIGHT,
            top: StyleConstants.CB_TOP,
            left: StyleConstants.CB_LEFT,
            backgroundImage: StyleConstants.CB_BG_IMAGE,
        },
        children: [
            {
                id: 'channelContainer',
                styles: {
                    width: StyleConstants.CH_CONTAINER_WIDTH,
                    height: StyleConstants.CH_CONTAINER_HEIGHT,
                    left: StyleConstants.CH_CONTAINER_LEFT,
                    top: StyleConstants.CH_CONTAINER_TOP,
                },
                children: [
                    {
                        id: 'channelInfoWrapper',
                        styles: {
                            width: StyleConstants.CH_WRAPPER_WIDTH,
                            height: StyleConstants.CH_CONTAINER_HEIGHT,
                            top: 0,
                            align: 'center',
                        },
                        children: [
                            {
                                id: 'channelNumber',
                                styles: {
                                    width: StyleConstants.CH_NUMBER_WIDTH,
                                    height: StyleConstants.CH_NUMBER_HEIGHT,
                                    left: StyleConstants.CH_NUMBER_LEFT,
                                    verticalAlign: 'middle',
                                    fontSize: StyleConstants.CH_NUMBER_FONT_SIZE,
                                    fontFamily: FONTS.Text,
                                    textAlign: 'center',
                                    fontColor: '#ffffff',
                                    text: String(channelNumber),
                                },
                            },
                            {
                                id: 'channelLogo',
                                styles: {
                                    width: StyleConstants.CH_LOGO_WIDTH,
                                    height: StyleConstants.CH_LOGO_HEIGHT,
                                    left: StyleConstants.CH_LOGO_LEFT,
                                    backgroundImage: path.join(__dirname, logo),
                                },
                            },
                        ],
                    },
                ],
            },
            {
                id: 'epgInfo',
                styles: {
                    width: StyleConstants.EPG_INFO_WIDTH,
                    height: StyleConstants.EPG_INFO_HEIGHT,
                    top: StyleConstants.EPG_INFO_TOP,
                    left: StyleConstants.EPG_INFO_LEFT,
                },
                children: [
                    {
                        id: 'eventProgressBarBg',
                        styles: {
                            width: StyleConstants.EPG_INFO_PROGRESS_BAR_WIDTH,
                            height: StyleConstants.EPG_INFO_PROGRESS_BAR_HEIGHT,
                            background: StyleConstants.EPG_INFO_PROGRESS_BAR_BG_COLOR,
                        },
                        children: [
                            {
                                id: 'eventProgressBar',
                                styles: {
                                    width: calculateProgressBarWidth(startTime, endTime),
                                    height: StyleConstants.EPG_INFO_PROGRESS_BAR_HEIGHT,
                                    background: StyleConstants.EPG_INFO_PROGRESS_BAR_COLOR,
                                },
                            },
                        ],
                    },
                    {
                        id: 'eventTitle',
                        styles: {
                            top: StyleConstants.EPG_INFO_TITLE_TOP,
                            left: 0,
                            width: StyleConstants.EPG_INFO_WIDTH,
                            height: StyleConstants.EPG_INFO_TITLE_HEIGHT,
                            fontSize: StyleConstants.CH_NUMBER_FONT_SIZE,
                            fontFamily: FONTS.Text,
                            fontColor: '#ffffff',
                            text: title,
                        },
                    },
                    {
                        id: 'eventTimeSpan',
                        styles: {
                            top: StyleConstants.EPG_INFO_SECONDARY_TITLE_TOP,
                            left: 0,
                            width: StyleConstants.EPG_INFO_WIDTH,
                            height: StyleConstants.EPG_INFO_SECONDARY_TITLE_HEIGHT,
                            fontSize: StyleConstants.CH_NUMBER_FONT_SIZE,
                            fontFamily: FONTS.Text,
                            fontColor: '#ffffff',
                            text: getTimeSpan(startTime, endTime),
                        },
                    },
                    {
                        id: 'epgInfoBottomLine',
                        styles: {
                            width: StyleConstants.EPG_INFO_BOTTOM_LINE_WIDTH,
                            height: StyleConstants.EPG_INFO_BOTTOM_LINE_HEIGHT,
                            top: StyleConstants.EPG_INFO_BOTTOM_LINE_TOP,
                            background: StyleConstants.EPG_INFO_BOTTOM_LINE_COLOR,
                        },
                    },
                ],
            },
        ],
    };
}

function render(model) {
    let viewNode;

    model.bindWatcher('channel', (oldValue, { logo, channelNumber }) => {
        const logoUpdates = { backgroundImage: path.join(__dirname, logo) };
        renderer.updateNode('channelLogo', logoUpdates, viewNode);
        renderer.updateNode('channelNumber', { text: String(channelNumber) }, viewNode);
    });
    model.bindWatcher('currentEvent', (oldValue, newValue) => {
        const timeSpan = getTimeSpan(newValue.startTime, newValue.endTime);
        const progressBarWidth = calculateProgressBarWidth(newValue.startTime, newValue.endTime);

        renderer.updateNode('eventProgressBar', { width: progressBarWidth }, viewNode);
        renderer.updateNode('eventTitle', { text: newValue.title }, viewNode);
        renderer.updateNode('eventTimeSpan', { text: timeSpan }, viewNode);
    });

    viewNode = renderer.renderLayout(getLayout(model));
}

function clean() {
    renderer.removeNode(rootNodeId);
}

module.exports = { render, clean };
