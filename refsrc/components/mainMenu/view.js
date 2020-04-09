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

const { renderLayout, removeNode, updateNode } = require('renderer');
const { SCREEN_SIZE } = require('shared/constants');
const path = require('path');

const Animation = require('shared/animation');

const rootNodeId = 'mainMenu';

const container = {
    width: SCREEN_SIZE.width,
    height: 90,
};

const item = {
    width: 410,
    marginLeft: 20,
};

const highlighter = {
    width: 300,
    height: 6,
    left: ((item.width - 300) / 2) + item.marginLeft,
};

const underline = {
    height: 2,
    bottom: 27,
};

function render(model) {
    let viewNode;

    model.bindWatcher('selectedIndex', (oldValue, newValue) => {
        const oldSelection = generateId(model.itemsProps[oldValue].text);
        const newSelection = generateId(model.itemsProps[newValue].text);

//        Animation.animate(viewNode.getNodeById('highlighter'), {
//            timingFunction: Animation.timingFunctions.LINEAR,
//            duration: 0.12,
//            xDistance: (newValue - oldValue) * item.width,
//        });

        updateNode(oldSelection, {
            fontColor: '#ffffff',
        }, viewNode);

        updateNode(newSelection, {
            fontColor: '#3489cd',
        }, viewNode);
    });

    const selectedIndex = model.get('selectedIndex');

    const nodes = {
        id: rootNodeId,
        styles: {
            width: container.width,
            height: container.height,
            top: SCREEN_SIZE.height - container.height,
            backgroundImage: path.join(__dirname, './assets/mainMenuGrad.png'),
        },
        children: [
            {
                id: 'underline',
                styles: {
                    width: container.width,
                    height: underline.height,
                    top: container.height - underline.bottom - underline.height,
                    background: '#ffffff',
                },
            },
//            {
//                id: 'highlighter',
//                styles: {
//                    width: highlighter.width,
//                    left: (selectedIndex * item.width) + highlighter.left,
//                    height: highlighter.height,
//                    top: container.height - underline.bottom - (highlighter.height / 2),
//                    background: '#3489cd',
//                },
//            },
        ],
    };

    nodes.children = nodes.children.concat(makeMenuItems(model.itemsProps, selectedIndex));

    viewNode = renderLayout(nodes);

    return viewNode;
}

function clean() {
    removeNode(rootNodeId);
}

function makeMenuItems(itemsProps, selectedIndex) {
    return itemsProps.map(({ text }, i) => {
        return {
            id: generateId(text),
            styles: {
                width: item.width,
                height: 60,
                textValign: 'middle',
                text: `${text}`,
                fontColor: i === selectedIndex ? '#3489cd' : '#ffffff',
                fontSize: 35,
                left: i ? (item.width * i) + item.marginLeft : item.marginLeft,
                textAlign: 'center',
            },
        };
    });
}

function generateId(data) {
    return data.toLowerCase().split(' ').join('_');
}

module.exports = {
    render,
    clean,
};
