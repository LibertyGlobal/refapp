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

class ViewModel {
    constructor(staticProps) {
        this.__watchers = new Map();
        this.__dynamicProps = new Map();

        Object.assign(this, staticProps);
    }

    has(key) {
        return this.__dynamicProps.has(key);
    }

    get(key) {
        if (!this.has(key)) {
            return undefined;
        }

        const { currValue } = this.__dynamicProps.get(key);
        return currValue;
    }

    set(key, value) {
        if (this.has(key)) {
            const { currValue } = this.__dynamicProps.get(key);
            if (currValue === value) {
                return;
            }

            this.__dynamicProps.set(key, {
                oldValue: currValue,
                currValue: value,
                isDirty: true,
            });
        } else {
            this.__dynamicProps.set(key, {
                oldValue: value,
                currValue: value,
                isDirty: false,
            });
        }
    }

    getCurrentDynamicProps() {
        return [...this.__dynamicProps]
            .reduce((obj, [prop, value]) => Object.defineProperty(obj, prop, {
                enumerable: true,
                value: value.currValue,
            }), {});
    }

    bindWatcher(key, handler) {
        this.__watchers.set(key, handler);
    }

    updateView() {
        this.__dynamicProps.forEach((value, key, map) => {
            const propState = map.get(key);
            if (propState.isDirty) {
                this.__watchers.get(key)(propState.oldValue, propState.currValue);
                propState.isDirty = false;
            }
        });
    }
}

module.exports = ViewModel;
