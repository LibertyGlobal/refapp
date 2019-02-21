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

const Model = require('shared/ViewModel');
const { paths } = require('navigation');

const itemsProps = [
    {
        text: 'MOVIES',
        path: paths.onDemand,
        props: {
            isStopPlayBackManually: true,
        },
    },
    {
        text: 'APPS',
        path: paths.apps,
        props: {
            isStopPlayBackManually: true,
        },
    },
    {
        text: 'SETTINGS',
        path: paths.warningPopup,
        props: {
            title: 'Settings are not available',
            content: 'Settings implementation is planned for future versions of the application',
            isStopPlayBackManually: false,
        },
    },
];

const model = new Model({ itemsProps });
model.set('selectedIndex', 0);

function moveLeft() {
    let selectedIndex = model.get('selectedIndex');
    selectedIndex = Math.max(0, selectedIndex - 1);
    model.set('selectedIndex', selectedIndex);
}

function moveRight() {
    let selectedIndex = model.get('selectedIndex');
    selectedIndex = Math.min(itemsProps.length - 1, selectedIndex + 1);
    model.set('selectedIndex', selectedIndex);
}

function getSelectedItem() {
    const selectedIndex = model.get('selectedIndex');
    return itemsProps[selectedIndex];
}

module.exports = {
    moveLeft,
    moveRight,
    model,
    getSelectedItem,
};
