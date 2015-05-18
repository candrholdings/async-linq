!function (assert, vows, linq) {
    'use strict';

    vows.describe('linq.elementAt.array').addBatch({
        'Get the second value from an array': {
            topic: linq([123, 456, 789]).elementAt(1).run(),
            'Should return the second value': function (topic) {
                assert.equal(456, topic);
            }
        },
        'Get an out-of-bound value from an array': {
            topic: linq([123, 456, 789]).elementAt(5).run(),
            'Should return undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        },
        'Get an item on an empty array': {
            topic: linq([]).elementAt(1).run(),
            'Should return undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        }
    }).export(module);

    vows.describe('linq.elementAt.map').addBatch({
        'Get the second name from a map': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).elementAt(1).run(),
            'Should return the second name': function (topic) {
                assert.equal('def', topic);
            }
        },
        'Get an out-of-bound value from a map': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).elementAt(5).run(),
            'Should return undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        },
        'Get an item on an empty map': {
            topic: linq({}).elementAt(1).run(),
            'Should return undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        },
        'Get an item on an unspecified map': {
            topic: linq().elementAt(1).run(),
            'Should return undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'));