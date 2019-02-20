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

const dbus = require('dbus-native');
const keyEventsEmitter = require('shared/eventEmitter');
const { Events } = require('shared/constants');
const logger = require('shared/logger');

const MODULE_NAME = 'keyEmitters/dbus';

const DbusConstants = {
    DBUS_MATCH: "type='signal',sender='process.iarm.IRMgr.Event',path='/iarm/signal/Object',interface='iarm.signal.Type',member='IRMgr'",
    DBUS_INTERFACE: 'iarm.signal.Type',
};

const systemBus = dbus.systemBus();
systemBus.addMatch(DbusConstants.DBUS_MATCH, (message) => {
    logger.debug(MODULE_NAME, 'addMatch', message);
});


let keyTypeCount;
let keyPrevType;

systemBus.connection.on('message', (message) => {

    // prevent non RCU message handling
    if (message.interface !== DbusConstants.DBUS_INTERFACE) {
        return;
    }

    const { body: msg } = message;

    // Discard DBus signal if data is empty or event ID is out of IRMgr range
    if (!msg[3] || (msg[0] > 2)) {
        return;
    }

    const data = msg[3];
    const keyType = data[73];
    const keyCode = data[76];

    // RF4C Probe key.
    if (keyCode === 178 || keyCode === 108) {
        return;
    }

    const rcuId = data[88];
    const keySource = data[84];

    keyTypeCount = (keyPrevType === keyType) ? keyTypeCount + 1 : 0;
    keyPrevType = keyType;

    const keyEvent = {
        keyCode, keyType, keyTypeCount, keySource, rcuId,
    };

    keyEventsEmitter.emit(Events.KEY_PRESSED, keyEvent);
});


module.exports = keyEventsEmitter;
