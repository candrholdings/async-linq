!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.aggregate.array').addBatch({
        'Aggregate numbers by product of first 4 items': {
            topic: linq([1, 2, 3, 4, 5]).aggregate(1, function (prev, curr, index) { return index < 4 ? prev * curr : prev; }, function (result) { return result * 100; }).run(),
            'Should return their product': function (topic) {
                assert.equal(topic, 2400);
            }
        },
        'Aggregate empty array': {
            topic: linq([]).aggregate(123, assert.fail).run(),
            'Should return seed value': function (topic) {
                assert.equal(topic, 123);
            }
        },
        'Missing func': util.error(linq([]).aggregate(0, null), 'missing func'),
        'Invalid func': util.error(linq([]).aggregate(0, 'invalid'), 'invalid func'),
        'Invalid resultSelector': util.error(linq([]).aggregate(0, function () {}, 'invalid'), 'invalid resultSelector')
    }).export(module);

    vows.describe('linq.aggregate.map').addBatch({
        'Aggregate numbers by product of first 4 items': {
            topic: linq({ a: 1, b: 2, c: 3, d: 4, e: 5 }).aggregate(1, function (prev, curr, name) { return name < 'e' ? prev * curr : prev; }, function (result) { return result * 100; }).run(),
            'Should return their product': function (topic) {
                assert.equal(topic, 2400);
            }
        },
        'Aggregate empty map': {
            topic: linq({}).aggregate(123, assert.fail).run(),
            'Should return seed value': function (topic) {
                assert.equal(topic, 123);
            }
        },
        'Aggregate undefined': {
            topic: linq().aggregate(undefined, assert.fail).run(),
            'Should return undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        },
        'Missing func': util.error(linq({}).aggregate(0, null), 'missing func'),
        'Invalid func': util.error(linq({}).aggregate(0, 'invalid'), 'invalid func'),
        'Invalid resultSelector': util.error(linq({}).aggregate(0, function () {}, 'invalid'), 'invalid resultSelector')
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));