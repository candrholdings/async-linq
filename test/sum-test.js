!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.sum.array').addBatch({
        'Summing up 1 to 5': {
            topic: linq([1, 2, 3, 4, 5]).sum().run(),
            'Should return 15': function (topic) {
                assert.equal(15, topic);
            }
        },
        'Summing up some non-numbers': {
            topic: linq([123, 456, 789, 'abc', 'def']).sum().run(),
            'Should return NaN': function (topic) {
                assert(isNaN(topic));
            }
        },
        'Summing up empty': {
            topic: linq([]).sum().run(),
            'Should return 0': function (topic) {
                assert.equal(topic, 0);
            }
        },
        'Summing up with a custom selector': {
            topic: linq(['abc123', 'def456', 'xyz789']).sum(function (value) { return +value.substr(3); }).run(),
            'Should return 1368': function (topic) {
                assert.equal(topic, 1368);
            }
        },
        'Invalid selector': util.error(linq([]).sum('invalid'), 'invalid selector')
    }).export(module);

    vows.describe('linq.xxx.map').addBatch({
        'Summing up 1 to 5': {
            topic: linq({ a: 1, b: 2, c: 3, d: 4, e: 5 }).sum().run(),
            'Should return 15': function (topic) {
                assert.equal(15, topic);
            }
        },
        'Summing up some non-numbers': {
            topic: linq({ abc: 123, def: 456, xyz: 789, ABC: 'abc', DEF: 'def' }).sum().run(),
            'Should return NaN': function (topic) {
                assert(isNaN(topic));
            }
        },
        'Summing up empty': {
            topic: linq({}).sum().run(),
            'Should return 0': function (topic) {
                assert.equal(topic, 0);
            }
        },
        'Summing up undefined': {
            topic: linq().sum().run(),
            'Should return 0': function (topic) {
                assert.equal(topic, 0);
            }
        },
        'Summing up with a custom selector': {
            topic: linq({ a: 'a123', de: 'de456', xyz: 'xyz789' }).sum(function (value, name) { return +value.substr(name.length); }).run(),
            'Should return 1368': function (topic) {
                assert.equal(topic, 1368);
            }
        },
        'Invalid selector': util.error(linq({}).sum('invalid'), 'invalid selector')
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));