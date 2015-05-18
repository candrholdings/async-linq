!function (assert, vows, linq) {
    'use strict';

    vows.describe('linq.orderBy.array').addBatch({
        'Reorder an array by value': {
            topic: linq([1, 5, 2, 4, 3]).orderBy(function (v) { return v; }).run(),
            'Should return an ordered array': function (topic) {
                assert.deepEqual(topic, [1, 2, 3, 4, 5]);
            }
        },
        'Reverse an array': {
            topic: linq([1, 5, 2, 4, 3]).orderBy(function (v, i) { return 5 - i; }).run(),
            'Should return a reversed array': function (topic) {
                assert.deepEqual(topic, [3, 4, 2, 5, 1]);
            }
        },
        'Reorder an array without selector': {
            topic: linq([1, 5, 2, 4, 3]).orderBy().run(),
            'Should return an array ordered by value': function (topic) {
                assert.deepEqual(topic, [1, 2, 3, 4, 5]);
            }
        },
        'Reorder an empty array': {
            topic: linq([]).orderBy(assert.fail).run(),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Reorder an array by value async': {
            topic: function () {
                var callback = this.callback;

                linq([1, 5, 2, 4, 3])
                    .async
                    .orderBy(function (value, index, callback) { 
                        callback(null, value);
                    })
                    .run(callback);
            },
            'Should return an ordered array': function (topic) {
                assert.deepEqual(topic, [1, 2, 3, 4, 5]);
            }
        }
    }).export(module);

    vows.describe('linq.orderBy.map').addBatch({
        'Reorder a map by value': {
            topic: linq({ a: 1, b: 5, c: 2, d: 4, e: 3 }).orderBy(function (v) { return v; }).run(),
            'Should return an ordered map': function (topic) {
                assert.deepEqual(topic, { a: 1, c: 2, e: 3, d: 4, b: 5 });
            }
        },
        'Reverse a map': {
            topic: linq({ a: 1, b: 5, c: 2, d: 4, e: 3 }).orderBy(function (v, n) { return 101 - n.charCodeAt(0); }).run(),
            'Should return a reversed array': function (topic) {
                assert.deepEqual(topic, { e: 3, d: 4, c: 2, b: 5, a: 1 });
            }
        },
        'Reorder a map without selector': {
            topic: linq({ a: 1, b: 5, c: 2, d: 4, e: 3 }).orderBy().run(),
            'Should return a map ordered by value': function (topic) {
                assert.deepEqual(topic, { a: 1, c: 2, e: 3, d: 4, b: 5 });
            }
        },
        'Reorder an empty map': {
            topic: linq({}).orderBy(assert.fail).run(),
            'Should return an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },
        'Reorder an undefined map': {
            topic: linq().orderBy(assert.fail).run(),
            'Should return an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'));