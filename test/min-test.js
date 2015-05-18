!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.min.array').addBatch({
        'Find the minimum value': {
            topic: linq([123, 456, 789]).min().run(),
            'Should return 123': function (topic) {
                assert.equal(topic, 123);
            }
        },
        'Find the minimum value with candidates of Infinity': {
            topic: linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, Infinity, -Infinity]).min().run(),
            'Should return -Infinity': function (topic) {
                assert.equal(topic, -Infinity);
            }
        },
        'Find the minimum value with some non-numbers': {
            topic: linq([123, 456, 789, 'abc', NaN, undefined]).min().run(),
            'Should return 123': function (topic) {
                assert.equal(topic, 123);
            }
        },
        'Find the minimum value with strings': {
            topic: linq(['abc', 'def', 'xyz']).min().run(),
            'Should return "abc"': function (topic) {
                assert.equal(topic, 'abc');
            }
        },
        'Find empty': {
            topic: linq([]).min().run(),
            'Should return undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        },
        'Find the minimum value with custom comparer': {
            topic: linq(['xyz123', 'def456', 'abc789']).min(function (value) { return +value.substr(3); }).run(),
            'Should return "xyz123"': function (topic) {
                assert.equal(topic, 'xyz123');
            }
        },
        'Invalid selector': util.error(linq([]).min('invalid'), 'invalid selector')
    }).export(module);

    vows.describe('linq.min.map').addBatch({
        'Find the minimum value': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).min().run(),
            'Should return "abc"': function (topic) {
                assert.equal(topic, 'abc');
            }
        },
        'Find the minimum value with candidates of Infinity': {
            topic: linq({ abc: 123, def: 456, xyz: 789, i: Infinity, I: -Infinity }).min().run(),
            'Should return "I"': function (topic) {
                assert.equal(topic, 'I');
            }
        },
        'Find the minimum value with some non-numbers': {
            topic: linq({ abc: 123, def: 456, xyz: 789, ABC: 'abc' }).min().run(),
            'Should return NaN': function (topic) {
                assert(isNaN(topic));
            }
        },
        'Find empty': {
            topic: linq({}).min().run(),
            'Should return undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        },
        'Find undefined': {
            topic: linq().min().run(),
            'Should return undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        },
        'Find the name with minimum value with custom comparer': {
            topic: linq({ abc: 'xyz123', def: 'def456', xyz: 'abc789' }).min(function (value) { return +value.substr(3); }).run(),
            'Should return "abc"': function (topic) {
                assert.equal(topic, 'abc');
            }
        },
        'Invalid selector': util.error(linq({}).min('invalid'), 'invalid selector')
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));