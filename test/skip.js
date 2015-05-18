!function (assert, vows, linq) {
    'use strict';

    vows.describe('linq.skip.array').addBatch({
        'Skip 3 items out of a 10-item array': {
            topic: linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]).skip(3).run(),
            'Should return last 7 items': function (topic) {
                assert.deepEqual(topic, [4, 5, 6, 7, 8, 9, 0]);
            }
        },
        'Skip 10 items out of a 3-item array': {
            topic: linq([1, 2, 3]).skip(10).run(),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Skip 3 items out of an empty array': {
            topic: linq([]).skip(3).run(),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Invalid count': {
            topic: function () {
                var callback = this.callback;

                linq([]).async.skip('invalid').run(function (err) {
                    callback(null, err);
                });
            },
            'Should throws': function (topic) {
                assert(topic instanceof Error);
            }
        }
    }).export(module);

    vows.describe('linq.skip.map').addBatch({
        'Skip 3 items out of a 10-item map': {
            topic: linq({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 0 }).skip(3).run(),
            'Should return first 7 items in a map': function (topic) {
                assert.deepEqual(topic, { d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 0 });
            }
        },
        'Skip 10 items out of a 3-item map': {
            topic: linq({ a: 1, b: 2, c: 3 }).skip(3).run(),
            'Should return an empty map': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Skip 3 items out of an empty map': {
            topic: linq({}).skip(3).run(),
            'Should return an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },
        'Skip 3 items out of an undefined value': {
            topic: linq().skip(3).run(),
            'Should return an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },
        'Invalid count': {
            topic: function () {
                var callback = this.callback;

                linq({}).async.skip('invalid').run(function (err) {
                    callback(null, err);
                });
            },
            'Should throws': function (topic) {
                assert(topic instanceof Error);
            }
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'));