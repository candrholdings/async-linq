!function (assert, vows, linq) {
    'use strict';

    vows.describe('linq.range').addBatch({
        'Creating a range from 1 with 10 items': {
            topic: linq.range(1, 10),
            'Should return an array from 1 to 10': function (topic) {
                assert.deepEqual(topic, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            }
        },
        'Creating a range from 1 with 0 items': {
            topic: linq.range(1, 0),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Creating a range from 1 with -1 items': {
            topic: linq.range(1, -1),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'));