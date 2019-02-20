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
exports.Node = class {
    constructor(id, { width, height, parent }) {
        this.styles = {};
        this.children = [];
        this.id = id;
        this.styles.width = width;
        this.styles.height = height;

        parent && parent.children.push(this);
    }

    setProto() {}
    setWidth(val) {
        this.styles.width = val;
    }
    setHeight(val) {
        this.styles.height = val;
    }
    setTop(val) {
        this.styles.top = val;
    }
    setLeft(val) {
        this.styles.left = val;
    }
    setBackgroundColorWithOpacity(val) {
        this.styles.backgroundColor = val;
    }
    setFontFamily(val) {
        this.styles.fontFamily = val;
    }
    setFontSize(val) {
        this.styles.fontSize = val;
    }
    setFontColorWithOpacity(val) {
        this.styles.fontColor = val;
    }
    setText(val) {
        this.styles.text = val;
    }
    setAlign(val) {
        this.styles.align = val;
    }
    setVerticalAlign(val) {
        this.styles.verticalAlign = val;
    }
    setTextAlign(val) {
        this.styles.textAlign = val;
    }
    setTextValign(val) {
        this.styles.textValign = val;
    }
    setTextOverflow(val) {
        this.styles.textOverflow = val;
    }
    setWordWrap(val) {
        this.styles.wordWrap = val;
    }
    setLineHeight(val) {
        this.styles.lineHeight = val;
    }
    setBorderImage(val) {
        this.styles.borderImage = '/path/to/image';
    }
    setBorderCenterFill(val) {
        this.styles.borderCenterFill = val;
    }
    setBorder(val) {
        this.styles.border = val;
    }
    setBorderColorWithOpacity(val) {
        this.styles.borderColor = val;
    }
    setPadding(val) {
        this.styles.padding = val;
    }
    setOverflow(val) {
        this.styles.overflow = val;
    }
    setVisible(val) {
        this.styles.visible = val;
    }
    setOpacity(val) {
        this.styles.opacity = val;
    }
    setFile(val) {
        this.styles.file = '/path/to/image';
    }

    getTop() {
        return this.styles.top;
    }
    getLeft() {
        return this.styles.left;
    }
    getBackgroundColorWithOpacity() {
        return this.styles.backgroundColorWithOpacity;
    }
    getFontFamily() {
        return this.styles.fontFamily;
    }
    getFontSize() {
        return this.styles.fontSize;
    }
    getFontColorWithOpacity() {
        return this.styles.fontColorWithOpacity;
    }
    getText() {
        return this.styles.text;
    }
    getAlign() {
        return this.styles.align;
    }
    getVerticalAlign() {
        return this.styles.verticalAlign;
    }
    getTextAlign() {
        return this.styles.textAlign;
    }
    getTextValign() {
        return this.styles.textValign;
    }
    getTextOverflow() {
        return this.styles.textOverflow;
    }
    getWordWrap() {
        return this.styles.wordWrap;
    }
    getLineHeight() {
        return this.styles.lineHeight;
    }
    getBorderImage() {
        return this.styles.borderImage;
    }
    getBorderCenterFill() {
        return this.styles.borderCenterFill;
    }
    getBorder() {
        return this.styles.border;
    }
    getBorderColorWithOpacity() {
        return this.styles.borderColorWithOpacity;
    }
    getPadding() {
        return this.styles.padding;
    }
    getOverflow() {
        return this.styles.overflow;
    }
    getVisible() {
        return this.styles.visible;
    }
    getOpacity() {
        return this.styles.opacity;
    }
    getFile() {
        return this.styles.file;
    }
    getWidth() {
        return this.styles.width;
    }
    getHeight() {
        return this.styles.height;
    }
    getNodeById(id) {
        return this.id === id ? this : this.children.find(child => child.getNodeById(id));
    }
    markMoving(state) {
        this.animOptions.state = state;
    }
    setPositionRelative(moveX, moveY) {
        this.styles.left += moveX;
        this.styles.top += moveY;
    }
    animate() {

    }

    toPretty() {
        const nodesStructure = JSON.stringify(formatNodesTree(this), null, 4);
        return `nodes structure:\n${nodesStructure}\nstyles:${formatStyles(this)}`;
    }
};

exports.Animation = {
    addTimeline(duration, cb) {
        cb(2);
    },
    posMapN() {},
    POS_MAP_LINEAR: 'POS_MAP_LINEAR',
};

function formatStyles(tree) {
    const queue = [];
    queue.push(tree);
    let res = '';

    while (queue.length) {
        const current = queue.shift();
        queue.push(...current.children);
        res += `\n${current.id} styles:\n${JSON.stringify(current.styles, null, 4)}`;
    }

    return res;
}

function formatNodesTree(root) {
    return {
        id: root.id,
        children: root.children.map(formatNodesTree),
    };
}
