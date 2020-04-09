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

const { listDirections } = require('shared/constants');

let counter = 0;

const getId = () => `list#${counter++}`;

function getElemWithNewPosition(elem, prevElem, index, margin, direction) {
    const left = direction === listDirections.ROW && prevElem
        ? (prevElem.styles.left + prevElem.styles.width + margin) : elem.left || 0;
    const top = direction === listDirections.COLUMN && prevElem
        ? (prevElem.styles.top + prevElem.styles.height + margin) : elem.left || 0;

    return Object.assign(
        {},
        elem,
        { styles: Object.assign({}, elem.styles, { top, left }) }
    );
}

function calculateListWidth(elements, elemMargin, direction) {
    return direction === listDirections.ROW
        ? elements.reduce((width, elem, i) => width + elem.styles.width + elemMargin, 0) - elemMargin
        : elements.reduce((width, elem) => Math.max(width, elem.styles.width), 0);
}

function calculateListHeight(elements, elemMargin, direction) {
    return direction === listDirections.COLUMN
        ? elements.reduce((height, elem, i) => height + elem.styles.height + elemMargin, 0) - elemMargin
        : elements.reduce((height, elem) => Math.max(height, elem.styles.height), 0);
}

/**
 * @typedef {string} id
 * @typedef {object} styles // definition of styles
 * @typedef {LayoutObject[]} children
 */
const LayoutObject = {}; /* eslint-disable-line */

/**
 * Layout helper which takes an array of elements,
 * creates a wrapper and applies top or left position for passed elements
 * some sort of:
 * display: flex; flex-direction: row|column;
 * @param {LayoutObject[]} elements
 * @param {number} elemMargin
 * @param {enum {row,column}} direction
 * @param {object} styles
 * @param {string} id
 * @returns {LayoutObject}
 */
module.exports = function ({
    elements = [],
    elemMargin = 0,
    padding = { vertical: 0, horizontal: 0 },
    direction = listDirections.ROW,
    styles = {},
    id = getId(),
} = {}) {
    const width = calculateListWidth(elements, elemMargin, direction);
    const height = calculateListHeight(elements, elemMargin, direction);

    return {
        id,
        styles: Object.assign(styles, { width, height }),
        children: elements.reduce((elems, elem, i) => {
            return elems.concat(getElemWithNewPosition(elem, elems[i - 1], i, elemMargin, direction));
        }, []),
    };
};
