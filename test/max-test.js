!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.max.array').addBatch({
        'Find the maximum value': {
            topic: linq([123, 456, 789]).max().run(),
            'Should return 789': function (topic) {
                assert.equal(topic, 789);
            }
        },
        'Find the maximum value with candidates of Infinity': {
            topic: linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, Infinity, -Infinity]).max().run(),
            'Should return Infinity': function (topic) {
                assert.equal(topic, Infinity);
            }
        },
        'Find the maximum value with some non-numbers': {
            topic: linq([123, 456, 789, 'abc', NaN, true, undefined, null]).max().run(),
            'Should return 789': function (topic) {
                // 'abc' > 789 === false
                // NaN > 789 === false
                // true > 789 === false
                // undefined > 789 === false
                // null > 789 === false
                assert.equal(topic, 789);
            }
        },
        'Find the maximum value with strings': {
            topic: linq(['abc', 'def', 'xyz']).max().run(),
            'Should return "xyz"': function (topic) {
                assert.equal(topic, 'xyz');
            }
        },
        'Find empty': {
            topic: linq([]).max().run(),
            'Should return undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        },
        'Find the maximum value with custom comparer': {
            topic: linq(['xyz123', 'def456', 'abc789']).max(function (value) { return +value.substr(3); }).run(),
            'Should return "abc789"': function (topic) {
                assert.equal(topic, 'abc789');
            }
        },
        'Invalid selector': util.error(linq([]).max('invalid'), 'invalid selector')
    }).export(module);

    vows.describe('linq.max.map').addBatch({
        'Find the maximum value': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).max().run(),
            'Should return 789': function (topic) {
                assert.equal(topic, 'xyz');
            }
        },
        'Find the maximum value with candidates of Infinity': {
            topic: linq({ abc: 123, def: 456, xyz: 789, i: Infinity, I: -Infinity }).max().run(),
            'Should return Infinity': function (topic) {
                assert.equal(topic, 'i');
            }
        },
        'Find the maximum value with some non-numbers': {
            topic: linq({ abc: 123, def: 456, xyz: 789, ABC: 'abc' }).max().run(),
            'Should return NaN': function (topic) {
                assert(isNaN(topic));
            }
        },
        'Find empty': {
            topic: linq({}).max().run(),
            'Should return undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        },
        'Find undefined': {
            topic: linq().max().run(),
            'Should return undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        },
        'Find the name with maximum value with custom comparer': {
            topic: linq({ abc: 'xyz123', def: 'def456', xyz: 'abc789' }).max(function (value) { return +value.substr(3); }).run(),
            'Should return "xyz"': function (topic) {
                assert.equal(topic, 'xyz');
            }
        },
        'Invalid selector': util.error(linq({}).max('invalid'), 'invalid selector')
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));