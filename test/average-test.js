!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.average.array').addBatch({
        'Find the average value': {
            topic: linq([123, 456, 789]).average(function (value, index) { return value * Math.pow(10, index); }).run(),
            'Should return 27861': function (topic) {
                assert.equal(topic, 27861);
            }
        },
        'Find the average value without a selector': {
            topic: linq([123, 4560, 78900]).average().run(),
            'Should return 27861': function (topic) {
                assert.equal(topic, 27861);
            }
        },
        'Find the average value with candidates of positive Infinity': {
            topic: linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, Infinity]).average().run(),
            'Should return Infinity': function (topic) {
                assert.equal(topic, Infinity);
            }
        },
        'Find the average value with candidates of both positive and negative Infinity': {
            topic: linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, Infinity, -Infinity]).average().run(),
            'Should return NaN': function (topic) {
                assert(isNaN(topic));
            }
        },
        'Find the average value with some non-numbers': {
            topic: linq([123, 456, 789, 'abc', 0]).average().run(),
            'Should return NaN': function (topic) {
                assert(isNaN(topic));
            }
        },
        'Find empty': {
            topic: linq([]).average().run(),
            'Should return NaN': function (topic) {
                assert(isNaN(topic));
            }
        },
        'Invalid selector': util.error(linq([]).average('invalid'), 'invalid selector')
    }).export(module);

    vows.describe('linq.average.map').addBatch({
        'Find the average value': {
            topic: linq({ abc: 123, def: 4560, xyz: 78900 }).average(function (value) {
                return +(value + '').substr(0, 3);
            }).run(),
            'Should return 123': function (topic) {
                assert.equal(topic, 456);
            }
        },
        'Find the average value with candidates of positive Infinity': {
            topic: linq({ abc: 123, def: 456, xyz: 789, i: Infinity }).average().run(),
            'Should return Infinity': function (topic) {
                assert.equal(topic, Infinity);
            }
        },
        'Find the average value with candidates of both positive and negative Infinity': {
            topic: linq({ abc: 123, def: 456, xyz: 789, i: Infinity, I: -Infinity }).average().run(),
            'Should return NaN': function (topic) {
                assert(isNaN(topic));
            }
        },
        'Find the average value with some non-numbers': {
            topic: linq({ abc: 123, def: 456, xyz: 789, ABC: 'abc' }).average().run(),
            'Should return NaN': function (topic) {
                assert(isNaN(topic));
            }
        },
        'Find empty': {
            topic: linq({}).average().run(),
            'Should return NaN': function (topic) {
                assert(isNaN(topic));
            }
        },
        'Find undefined': {
            topic: linq().average().run(),
            'Should return undefined': function (topic) {
                assert(isNaN(topic));
            }
        },
        'Invalid selector': util.error(linq({}).average('invalid'), 'invalid selector')
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));