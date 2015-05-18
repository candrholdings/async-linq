!function (assert, vows, linq) {
    'use strict';

    vows.describe('linq.orderByDescending.array').addBatch({
        'Reorder an array by value': {
            topic: linq([1, 5, 2, 4, 3]).orderByDescending(function (v) { return v; }).run(),
            'Should return an ordered array': function (topic) {
                assert.deepEqual(topic, [5, 4, 3, 2, 1]);
            }
        },
        'Reverse an array': {
            topic: linq([1, 5, 2, 4, 3]).orderByDescending(function (v, i) { return i; }).run(),
            'Should return a reversed array': function (topic) {
                assert.deepEqual(topic, [3, 4, 2, 5, 1]);
            }
        },
        'Reorder an array without selector': {
            topic: linq([1, 5, 2, 4, 3]).orderByDescending().run(),
            'Should return an array ordered by value': function (topic) {
                assert.deepEqual(topic, [5, 4, 3, 2, 1]);
            }
        },
        'Reorder an empty array': {
            topic: linq([]).orderByDescending(assert.fail).run(),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        }
    }).export(module);

    vows.describe('linq.orderByDescending.map').addBatch({
        'Reorder a map by value': {
            topic: linq({ a: 1, b: 5, c: 2, d: 4, e: 3 }).orderByDescending(function (v) { return v; }).run(),
            'Should return an ordered map': function (topic) {
                assert.deepEqual(topic, { b: 5, d: 4, e: 3, c: 2, a: 1 });
            }
        },
        'Reverse a map': {
            topic: linq({ a: 1, b: 5, c: 2, d: 4, e: 3 }).orderByDescending(function (v, n) { return n.charCodeAt(0); }).run(),
            'Should return a reversed array': function (topic) {
                assert.deepEqual(topic, { e: 3, d: 4, c: 2, b: 5, a: 1 });
            }
        },
        'Reorder a map without selector': {
            topic: linq({ a: 1, b: 5, c: 2, d: 4, e: 3 }).orderByDescending().run(),
            'Should return a map ordered by value': function (topic) {
                assert.deepEqual(topic, { b: 5, d: 4, e: 3, c: 2, a: 1 });
            }
        },
        'Reorder an empty map': {
            topic: linq({}).orderByDescending(assert.fail).run(),
            'Should return an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },
        'Reorder an undefined map': {
            topic: linq().orderByDescending(assert.fail).run(),
            'Should return an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'));