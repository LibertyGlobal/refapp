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
const { renderLayout } = require('renderer');

const AMOUNT_OF_NODES = 1000;

function randomColor() {
    return (Math.random()*(1<<24)<<8)|0xff
  }

function createNodesLayer() {
    return {
        
    }
}

function show () {
    const root = { id: 'root', width: 100, height: 100, background: randomColor }
    for (let i = 0; i < AMOUNT_OF_NODES; i++) {

    }
}

module.exports = {
    show,
    hide () {},
    onKey () {},
    name: 'Px test',
};