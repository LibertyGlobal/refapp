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
module.exports = {
    'extends': 'airbnb-base',
    'plugins': ['import', 'promise'],
    'env': {
        'node': true,
        'mocha': true
    },
    'parserOptions': {
        'ecmaVersion': 6,
        'sourceType': 'script'
    },
    'settings': {
        'import/resolver': {
            'eslint-import-resolver-node': {
                'moduleDirectory': [ 'src' ]
            }
        },
        // a list of modules that should be resolved but are installed globally (or have no path on the filesystem)
        'import/core-modules': ['lgire', 'srvmgr', 'iarm-bus']
    },
    'globals': {
        'require' : true,
        'environment' : true,
        'exports': true,
        'setInterval': true,
        'setTimeout': true,
        'clearTimeout': true,
        'clearInterval': true,
        'process': true,
        'sinon': true,
        'expect': true,
        'px': true,
        'scene': true,
    },
    'rules': {
        // Override some AirBNB rules
        'indent': ['error', 4, { "SwitchCase": 1 }], // we use 4 spaces for indents
        'strict': ['error', 'global'], // we don't use neither ES2015 nor Babel
        'no-plusplus': 0, // allow ++ -- in loops
        'no-use-before-define': ['error', 'nofunc'], // allow functions to be used before function declarations
        'no-unused-vars': ['error', { vars: 'local', args: 'none' }],
        'no-unused-expressions': 0, // allow .to.be.true in specs
        'arrow-body-style': 'off',
        'no-shadow': 'off',
        'func-names': 'off',
        'no-underscore-dangle': 'off',
        'max-len': 'off',
        'no-bitwise': 'off',
        'no-mixed-operators': 'warn',
        'no-param-reassign': ['warn', { 'props': false }],
        'padded-blocks': 'off',
        'no-nested-ternary': 'off',
        'prefer-rest-params': 'warn',
        'guard-for-in': 'warn',
        'no-restricted-syntax': 'warn',
        'curly': ["warn", "all"],
        'object-curly-newline': 'off',
        "comma-dangle": ["error", {
            "arrays": "always-multiline",
            "objects": "always-multiline",
            "imports": "always-multiline",
            "exports": "always-multiline",
            "functions": "ignore"
        }],

        // Override Airbnb rules from 'import' eslint plugin
        'import/no-unresolved': ['error', { 'commonjs': true }],
        'import/no-dynamic-require': 'off',
        'import/no-extraneous-dependencies': ['error', {
            // don't show an error when optional and dev dependencies are imported
              devDependencies: true,
              optionalDependencies: true,
            }],

        'global-require': 'warn',

        // Temporary set these Airbnb rules to warn level
        // to gradually clean up and stylize the code.
        'quotes': ['warn', 'single', { avoidEscape: true }],
        'quote-props': ['warn', 'as-needed', { 'keywords': false, 'unnecessary': true, 'numbers': false }],
        'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 1 }],
        'prefer-arrow-callback': ['warn', {
              allowNamedFunctions: false,
              allowUnboundThis: true,
            }],
        'vars-on-top': 'warn',
        'prefer-template': 'warn',
        'operator-assignment': ['warn', 'always'],
        'object-shorthand': ['warn', 'always', {
              ignoreConstructors: false,
              avoidQuotes: true,
            }],
        'no-template-curly-in-string': 'warn',
        'spaced-comment': ['warn', 'always', {
            line: {
                exceptions: ['-', '+'],
                markers: ['=', '!'], // space here to support sprockets directives
            },
            block: {
                exceptions: ['-', '+'],
                markers: ['=', '!'], // space here to support sprockets directives
                balanced: false,
                }
            }],
        'space-infix-ops': 'warn',
        'prefer-const': ['warn', {
              destructuring: 'any',
              ignoreReadBeforeAssign: true,
            }],
        'no-case-declarations': 'error',
        'class-methods-use-this': 'off', // some classes have methods without 'this' - fixing this requires a lot of refactoring.

        // for Promise plugin
        'promise/catch-or-return': 'error',
        'promise/no-promise-in-callback': 'error',
        'promise/no-callback-in-promise': 'error',
    }
};
