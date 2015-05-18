!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.count.array').addBatch({
        'Count number of items': {
            topic: linq([123, undefined, 456, null, 789]).count().run(),
            'Should return 5': function (topic) {
                assert.equal(topic, 5);
            }
        },
        'Count number of items that match a predicate': {
            topic: linq([123, undefined, 456, null, 789]).count(function (value, index) { return typeof value === 'number' && index < 3; }).run(),
            'Should return 2': function (topic) {
                assert.equal(topic, 2);
            }
        },
        'Count empty': {
            topic: linq([]).count().run(),
            'Should return 0': function (topic) {
                assert.equal(topic, 0);
            }
        },
        'Invalid predicate': util.error(linq([]).count('invalid'), 'invalid predicate')
    }).export(module);

    vows.describe('linq.count.map').addBatch({
        'Count number of items': {
            topic: linq({ abc: 123, u: undefined, def: 456, n: null, xyz: 789 }).count().run(),
            'Should return 5': function (topic) {
                assert.equal(topic, 5);
            }
        },
        'Count number of items that match a predicate': {
            topic: linq({ abc: 123, u: undefined, def: 456, n: null, xyz: 789 }).count(function (value, name) { return typeof value === 'number' && (name === 'abc' || name === 'def'); }).run(),
            'Should return 2': function (topic) {
                assert.equal(topic, 2);
            }
        },
        'Count empty': {
            topic: linq({}).count().run(),
            'Should return 0': function (topic) {
                assert.equal(topic, 0);
            }
        },
        'Count undefined': {
            topic: linq().count().run(),
            'Should return 0': function (topic) {
                assert.equal(topic, 0);
            }
        },
        'Invalid predicate': util.error(linq({}).count('invalid'), 'invalid predicate')
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));