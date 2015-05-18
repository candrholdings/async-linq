!function (assert, vows, linq) {
    'use strict';

    vows.describe('linq.take.array').addBatch({
        'Take 3 items out of a 10-item array': {
            topic: linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]).take(3).run(),
            'Should return first 3 items': function (topic) {
                assert.deepEqual(topic, [1, 2, 3]);
            }
        },
        'Take 10 items out of a 3-item array': {
            topic: linq([1, 2, 3]).take(10).run(),
            'Should return all 3 items': function (topic) {
                assert.deepEqual(topic, [1, 2, 3]);
            }
        },
        'Take 3 items out of an empty array': {
            topic: linq([]).take(3).run(),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Invalid count': {
            topic: function () {
                var callback = this.callback;

                linq([]).async.take('invalid').run(function (err) {
                    callback(null, err);
                });
            },
            'Should throws': function (topic) {
                assert(topic instanceof Error);
            }
        }
    }).export(module);

    vows.describe('linq.take.map').addBatch({
        'Take 3 items out of a 10-item map': {
            topic: linq({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 0 }).take(3).run(),
            'Should return first 3 items in a map': function (topic) {
                assert.deepEqual(topic, { a: 1, b: 2, c: 3 });
            }
        },
        'Take 10 items out of a 3-item map': {
            topic: linq({ a: 1, b: 2, c: 3 }).take(10).run(),
            'Should return all 3 items': function (topic) {
                assert.deepEqual(topic, { a: 1, b: 2, c: 3 });
            }
        },
        'Take 3 items out of an empty map': {
            topic: linq({}).take(3).run(),
            'Should return an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },
        'Take 3 items out of an undefined value': {
            topic: linq().take(3).run(),
            'Should return an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },
        'Invalid count': {
            topic: function () {
                var callback = this.callback;

                linq({}).async.take('invalid').run(function (err) {
                    callback(null, err);
                });
            },
            'Should throws': function (topic) {
                assert(topic instanceof Error);
            }
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'));