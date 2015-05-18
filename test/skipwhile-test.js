!function (assert, vows, linq) {
    'use strict';

    vows.describe('linq.skipWhile.array').addBatch({
        'Skip while < 5': {
            topic: linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]).skipWhile(function (value) { return value < 5; }).run(),
            'Should skip first 4 items': function (topic) {
                assert.deepEqual(topic, [5, 6, 7, 8, 9, 0]);
            }
        },
        'Skip while < 0': {
            topic: linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]).skipWhile(function (value) { return value < 0; }).run(),
            'Should return the original array': function (topic) {
                assert.deepEqual(topic, [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
            }
        },
        'Skip while < 100': {
            topic: linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]).skipWhile(function (value) { return value < 100; }).run(),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Skip while index < 5': {
            topic: linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]).skipWhile(function (value, index) { return index < 5; }).run(),
            'Should skip the first 5 items': function (topic) {
                assert.deepEqual(topic, [6, 7, 8, 9, 0]);
            }
        },
        'Skip while without predicate': {
            topic: linq([false, null, undefined, 0, 1, 2, 3]).skipWhile().run(),
            'Should skip falsy values': function (topic) {
                assert.deepEqual(topic, [1, 2, 3]);
            }
        },
        'Invalid predicate': {
            topic: function () {
                var callback = this.callback;

                linq([]).async.skipWhile('invalid').run(function (err) {
                    callback(null, err);
                });
            },
            'Should throws': function (topic) {
                assert(topic instanceof Error);
            }
        }
    }).export(module);

    vows.describe('linq.skipWhile.map').addBatch({
        'Skip while value < 5': {
            topic: linq({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 0 }).skipWhile(function (value, name) { return value < 5; }).run(),
            'Should skip first 4 items': function (topic) {
                assert.deepEqual(topic, { e: 5, f: 6, g: 7, h: 8, i: 9, j: 0 });
            }
        },
        'Skip while value < 0': {
            topic: linq({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 0 }).skipWhile(function (value, name) { return value < 0; }).run(),
            'Should skip the original map': function (topic) {
                assert.deepEqual(topic, { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 0 });
            }
        },
        'Skip while value < 100': {
            topic: linq({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 0 }).skipWhile(function (value, name) { return value < 100; }).run(),
            'Should skip an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },
        'Skip while name <= "e"': {
            topic: linq({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 0 }).skipWhile(function (value, name) { return name <= 'e'; }).run(),
            'Should skip the first 5 items': function (topic) {
                assert.deepEqual(topic, { f: 6, g: 7, h: 8, i: 9, j: 0 });
            }
        },
        'Skip while without predicate': {
            topic: linq({ f: false, n: null, u: undefined, z: 0, a: 1, b: 2, c: 3 }).skipWhile().run(),
            'Should skip falsy values': function (topic) {
                assert.deepEqual(topic, { a: 1, b: 2, c: 3 });
            }
        },
        'Invalid predicate': {
            topic: function () {
                var callback = this.callback;

                linq({}).async.skipWhile('invalid').run(function (err) {
                    callback(null, err);
                });
            },
            'Should throws': function (topic) {
                assert(topic instanceof Error);
            }
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'));