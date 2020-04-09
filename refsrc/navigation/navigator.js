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

const { types } = require('./constants');

let routes;

let routesStack = [];
let iterator;

function init() {
    routes = require('./routes');

    return Promise.resolve();
}

function find(path, routes) {
    let routesTree = [];
    routes.forEach((r) => {
        if (r.path === path) {
            routesTree.push(r);
        } else if (r.children) {
            routesTree = find(path, r.children);
            if (routesTree.length > 0) {
                routesTree.push(r);
            }
        }
    });

    return routesTree;
}

function* stackIterator() {
    let index = routesStack.length - 1;
    while (index >= 0) {
        yield routesStack[index];
        index -= 1;
    }
}

function restartIterator() {
    iterator = stackIterator();
}

function hideComponent() {
    const { component } = routesStack.pop();
    component.hide();
}

function isGoToPopUp(routesToGo) {
    return routesToGo.length === 1 && routesToGo[0].type === types.POPUP;
}

function go(path, params) {
    const routesToGo = find(path, routes).reverse();

    if (!routesToGo.length) {
        return;
    }

    if (!isGoToPopUp(routesToGo)) {
        back();
    }

    routesStack = routesStack.concat(routesToGo);
    restartIterator();
    routesToGo.reverse().forEach((route) => {
        if (route.component) {
            route.component.show(params);
        }
    });
}

function back() {
    let stackLength = routesStack.length;

    if (stackLength === 0) {
        return false;
    }

    if (routesStack[stackLength - 1].type === types.POPUP) {
        hideComponent();
        return true;
    }

    while (stackLength--) {
        hideComponent();
    }

    return true;
}

function getNextComponent() {
    const route = iterator.next().value;

    return route && route.component;
}

function getTopComponent() {
    const topRoute = routesStack[routesStack.length - 1];

    return topRoute && topRoute.component;
}

module.exports = {
    init,
    go,
    back,
    getNextComponent,
    getTopComponent,
    restartIterator,
};
