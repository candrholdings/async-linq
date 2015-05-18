!function (assert, vows, linq) {
    'use strict';

    vows.describe('linq.repeat').addBatch({
        'Creating a repeat of 5 x "ABC"': {
            topic: linq.repeat('ABC', 5),
            'Should return an array of 5 x "ABC"': function (topic) {
                assert.deepEqual(topic, ['ABC', 'ABC', 'ABC', 'ABC', 'ABC']);
            }
        },
        'Creating a repeat of 0 x "ABC"': {
            topic: linq.repeat('ABC', 0),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Creating a repeat of -1 x "ABC"': {
            topic: linq.repeat('ABC', -1),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'));