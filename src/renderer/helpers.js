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

function fromStringColorToColorObject(colour) {
    const LENGTH_OF_HEX_COLOUR_CODE = 7;
    const isStringDefinedColour = typeof colour === 'string';
    const isHexColourCode = isStringDefinedColour && colour.length === LENGTH_OF_HEX_COLOUR_CODE;

    let colourObj;

    if (typeof colour === 'object') {
        colourObj = colour;
    } else if (isStringDefinedColour && /^rgba\(*/.test(colour)) {
        colourObj = parseColourRGBAToObject(colour);
    } else if (isHexColourCode) {
        colourObj = parseColourHexCodeToObject(colour);
    }

    return colourObj;
}

function parseColourHexCodeToObject(colour) {
    return {
        red: parseInt(colour.substring(1, 3), 16),
        green: parseInt(colour.substring(3, 5), 16),
        blue: parseInt(colour.substring(5, 7), 16),
        alpha: 255,
    };
}

function parseColourRGBAToObject(colour) {
    const [red, green, blue, alpha] = colour.match(/[0-9.]+/g);
    return {
        red: Math.max(0, Math.min(red, 255)),
        green: Math.max(0, Math.min(green, 255)),
        blue: Math.max(0, Math.min(blue, 255)),
        alpha: Math.max(0, Math.min(fromUnitOpacityToByteOpacity(alpha, 255))),
    };
}

function fromUnitOpacityToByteOpacity(opacity) {
    return Math.round(255 * opacity);
}

module.exports = {
    fromStringColorToColorObject,
    fromUnitOpacityToByteOpacity,
};

