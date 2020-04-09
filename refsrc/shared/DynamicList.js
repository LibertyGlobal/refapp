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
const { generateId, nop } = require('shared/utils');
const logger = require('shared/logger'); // eslint-disable-line
const { SCREEN_SIZE, listDirections } = require('shared/constants');
const { animate, timingFunctions } = require('shared/animation');

const moduleName = 'DynamicList'; // eslint-disable-line

const makeListContainer = generateId('dynamicListContainer');
const makeItemIdGenerator = parentNodeId => generateId(`${parentNodeId}::item`);

const modes = {
    MOVABLE: 'movable',
    SIMPLE: 'simple',
};

const listGenerators = {
    [modes.MOVABLE]: generateMovableList,
    [modes.SIMPLE]: generateSimpleList,
};

class DynamicList {
    constructor({
        listItemGenerator = nop,
        styles = {},
        id,
        root,
        direction = listDirections.ROW,
    }) {

        this.listItemGenerator = listItemGenerator;
        this.root = root;
        this.direction = direction;
        this.listContainer = {
            id: makeListContainer(id),
            styles: {
                width: styles.width || 0,
                height: styles.height || 0,
            },
            children: [],
        };

        this.itemIdGenerator = makeItemIdGenerator(this.listContainer.id);

        this.list = {
            id,
            styles,
            children: [this.listContainer],
        };

        this.restore();

    }

    /**
     *
     * @param  {array} [elementsData=[]]
     * @return {DynamicList}
     * @memberof DynamicList
     */
    generateList({
        elementsData = [],
        movable = false,
    } = {}) {
        this.mode = movable ? modes.MOVABLE : modes.SIMPLE;
        this.elementsData = elementsData;
        listGenerators[this.mode].call(this);
        return this;
    }

    /**
     *
     * @param  {number} index
     * @param  {object} newItem
     * @return {DynamicList}
     * @memberof DynamicList
     */
    updateItem(index, newItem) {
        this.items.set(index, newItem);
        const parentNode = this.root.node.getNodeById(this.listContainer.id);
        newItem.id = this.itemIdGenerator(index);
        const childrenCount = newItem.children && newItem.children.length || 0;
        for (let i = 0; i < childrenCount; i++) {
            extendsChildrenIds(newItem.id, i, newItem.children[i]);
        }
        renderer.renderLayout(newItem, parentNode);
        return this;
    }

    /**
     * @param  {Object} options
     * @param {size} options.size - px to move
     * @param {number} options.duration - duration in sec
     * @param {string} options.timingFunction - type of timing function
     * @return {DynamicList}
     * @memberof DynamicList
     */
    move({ size = 0, duration = 0, timingFunction = timingFunctions.LINEAR } = {}) {
        const distance = this.direction === listDirections.ROW ? 'xDistance' : 'yDistance';
        const animationProps = {
            timingFunction,
            duration,
            [distance]: size,
        };
        this.border -= size;
        createVisibleItems.call(this, this.border);
        animate(this.root.node.getNodeById(this.listContainer.id), animationProps);
        return this;
    }

    /**
     * Delete current dynamic list items and reset all initial props
     * @return {DynamicList}
     * @memberof DynamicList
     */
    restore() {
        this.items && this.items.forEach((v, k) => renderer.removeNode(k));
        this.items = new Map();
        this.headIndex = 0;
        this.tailIndex = 0;
        const styleToCheck = this.direction === listDirections.ROW ? 'width' : 'height';
        this.border = this.listContainer.styles[styleToCheck] || SCREEN_SIZE[styleToCheck];
        return this;
    }
}

function extendsChildrenIds(parentId, index, item) {
    item.id = item.id ? `${makeItemIdGenerator(parentId)(index)}-${item.id}` : makeItemIdGenerator(parentId)(index);
    const childrenCount = item.children && item.children.length || 0;
    for (let i = 0; i < childrenCount; i++) {
        extendsChildrenIds(item.id, index, item.children[i]);
    }
}

function generateSimpleList() {
    const countOfIterations = Math.max(this.items.size, this.elementsData.length);
    let prevItem;
    for (let index = 0; index < countOfIterations; index++) {
        const itemData = this.elementsData[index];
        const newItem = this.listItemGenerator(itemData, prevItem);
        this.updateItem(index, newItem);
        prevItem = newItem;
    }
}

function generateMovableList() {
    this.restore();
    const { length } = this.elementsData;
    let prevItem;
    const styleToCheck = this.direction === listDirections.ROW ? 'left' : 'top';
    for (let index = 0; index < length; index++) {
        const itemData = this.elementsData[index];
        const newItem = this.listItemGenerator(itemData, prevItem);
        if (newItem.styles[styleToCheck] > this.border) {
            break;
        }
        this.headIndex = index;
        this.updateItem(index, newItem);
        prevItem = newItem;
    }
}

function createVisibleItems(border) {
    const { left, width, top, height } = this.items.get(this.headIndex).styles;
    const styleToCheck = this.direction === listDirections.ROW ? left + width : top + height;
    if (styleToCheck <= border) {
        const newIndex = this.headIndex + 1;
        const newItemData = this.elementsData[newIndex];
        if (newItemData) {
            const newItem = this.listItemGenerator(this.elementsData[newIndex], this.items.get(this.headIndex));
            this.headIndex = newIndex;
            this.updateItem(newIndex, newItem);
            return createVisibleItems.call(this, border);
        }
    }
    return null;
}

module.exports = DynamicList;
