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

const elementIdGetters = {
    title: sectionType => `section-${sectionType}-title`,
    underline: sectionType => `section-${sectionType}-underline`,
    tileLogo: (sectionType, index) => `${sectionType}-logo#${index}`,
    tileTitle: (sectionType, index) => `${sectionType}-title#${index}`,
};

function getIdBySectionType(sectionType, elementType, tileIndex = 0) {
    return elementIdGetters[elementType](sectionType, tileIndex);
}

module.exports = {
    getIdBySectionType,
    elementIdGetters,
};
