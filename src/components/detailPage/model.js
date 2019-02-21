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

const model = new Model();

function initModel(entity) {
    const { year, starRating, mediumSynopsis, title } = entity;
    model.set('year', year);
    model.set('starRating', starRating);
    model.set('mediumSynopsis', mediumSynopsis);
    model.set('title', title);
    model.entity = entity;
}

module.exports = {
    model,
    initModel,
};
