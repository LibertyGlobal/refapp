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

const { Node } = require('lgire');
const { SCREEN_SIZE, FONTS } = require('shared/constants');
const { fromStringColorToColorObject } = require('./helpers');
const { nop } = require('shared/utils');
const path = require('path');

// disabling node debug output
Node.prototype.setProto({
    debug: nop,
    log: nop,
    err: nop,
    warn: nop,
});

const rootNode = new Node('root', { width: SCREEN_SIZE.width, height: SCREEN_SIZE.height });
rootNode.setVisible(true);

const StylesExecitonList = new Map();

const StyleProperties = [
    ['width', (node, value = 0) => node.setWidth(value)],
    ['height', (node, value = 0) => node.setHeight(value)],
    ['top', (node, value = 0) => node.setTop(value)],
    ['left', (node, value = 0) => node.setLeft(value)],
    ['background', (node, value = 'rgba(0,0,0,0)') => {
        const colorObj = fromStringColorToColorObject(value);
        node.setBackgroundColorWithOpacity(colorObj, colorObj.alpha || 0);
    }],
    ['fontFamily', (node, value = FONTS.Text) => node.setFontFamily(value)],
    ['fontSize', (node, value = 12) => node.setFontSize(value)],
    ['fontColor', (node, value = 'rgba(0,0,0,0)') => {
        const colorObj = fromStringColorToColorObject(value);
        node.setFontColorWithOpacity(colorObj, colorObj.alpha || 0);
    }],
    ['text', (node, value = '') => node.setText(value)],
    ['align', (node, value = 'left') => node.setAlign(value)],
    ['verticalAlign', (node, value = 'top') => node.setVerticalAlign(value)],
    ['textAlign', (node, value = 'left') => node.setTextAlign(value)],
    ['textValign', (node, value = 'top') => node.setTextValign(value)],
    ['textOverflow', (node, value = true) => node.setTextOverflow(value)],
    ['wordWrap', (node, value = null) => node.setWordWrap(value)],
    ['lineHeight', (node, value = null) => node.setLineHeight(value)],
    ['borderImage', (node, value = path.resolve(__dirname, '../img/node/border.png')) => node.setBorderImage(value)],
    ['borderCenterFill', (node, value = false) => node.setBorderCenterFill(value)],
    ['border', (node, value = []) => node.setBorder(...value)],
    ['borderColor', (node, value = 'rgba(0,0,0,0)') => {
        const colorObj = fromStringColorToColorObject(value);
        node.setBorderColorWithOpacity(colorObj, colorObj.alpha || 0);
    }],
    ['padding', (node, value = []) => node.setPadding(...value)],
    ['overflow', (node, value = '') => node.setOverflow(value)],
    ['visible', (node, value = true) => node.setVisible(value)],
    ['opacity', (node, value = 255) => node.setOpacity(value)],
    ['backgroundImage', (node, value = '') => node.setFile(value)],
];

StyleProperties.forEach(style => StylesExecitonList.set(style[0], style[1]));

function renderLayout(layout, parent = rootNode) {
    const viewNode = createOrUpdateNode(layout.id, layout.styles, parent);

    const childrenCount = layout.children && layout.children.length || 0;
    for (let i = 0; i < childrenCount; i++) {
        renderLayout(layout.children[i], viewNode);
    }

    return viewNode;
}

function createOrUpdateNode(id, styles, parent) {
    const node = rootNode.getNodeById(id);
    if (node) {
        return updateStyles(node, styles);
    }

    return createNode(id, styles, parent);
}

function createNode(id, definition, parent) {
    const { width = 0, height = 0 } = definition;
    const node = new Node(id, { width, height, parent });
    setStyles(node, definition);
    return node;
}

function removeNode(id) {
    const node = rootNode.getNodeById(id);
    node && node.parent.removeChild(node);
}

function setStyles(node, definition) {
    StylesExecitonList.forEach((func, key) => {
        func(node, definition[key]);
    });
}

function updateStyles(node, definition) {
    const styles = Object.keys(definition);
    styles.forEach((style) => {
        if (StylesExecitonList.has(style)) {
            StylesExecitonList.get(style)(node, definition[style]);
        }
    });

    return node;
}

function updateNode(id, styles, root = rootNode) {
    const node = root.getNodeById(id);
    updateStyles(node, styles);
    return node;
}

function setMainViewVisibility(visibility) {
    rootNode.setVisible(visibility);
}

module.exports = {
    createOrUpdateNode,
    renderLayout,
    removeNode,
    updateNode,
    createNode,
    updateStyles,
    setMainViewVisibility,
};
