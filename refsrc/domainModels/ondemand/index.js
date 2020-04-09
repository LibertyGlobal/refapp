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

const { getMovies } = require('./service');

let movies;

function init(formatter) {
    return getMovies()
        .then(formatter)
        .then((data) => {
            movies = data;
        });
}

function getOnDemandMovies() {
    return movies;
}

function getRecommendedMovies() {
    return getMovies().then(movies => [
        movies[5],
        movies[10],
        movies[35],
    ]);
}

module.exports = {
    init,
    getOnDemandMovies,
    getRecommendedMovies,
};
