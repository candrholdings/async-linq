!function (assert, vows, linq) {
    'use strict';

    vows.describe('linq.takeWhile.array').addBatch({
        'Take while < 5': {
            topic: linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]).takeWhile(function (value) { return value < 5; }).run(),
            'Should return first 4 items': function (topic) {
                assert.deepEqual(topic, [1, 2, 3, 4]);
            }
        },
        'Take while < 0': {
            topic: linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]).takeWhile(function (value) { return value < 0; }).run(),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Take while < 100': {
            topic: linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]).takeWhile(function (value) { return value < 100; }).run(),
            'Should return the original array': function (topic) {
                assert.deepEqual(topic, [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
            }
        },
        'Take while index < 5': {
            topic: linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]).takeWhile(function (value, index) { return index < 5; }).run(),
            'Should return the first 5 items': function (topic) {
                assert.deepEqual(topic, [1, 2, 3, 4, 5]);
            }
        },
        'Take while without predicate': {
            topic: linq([1, 2, 3, false, 4, 5, 6]).takeWhile().run(),
            'Should return the first 3 items': function (topic) {
                assert.deepEqual(topic, [1, 2, 3]);
            }
        },
        'Invalid predicate': {
            topic: function () {
                var callback = this.callback;

                linq([]).async.takeWhile('invalid').run(function (err) {
                    callback(null, err);
                });
            },
            'Should throws': function (topic) {
                assert(topic instanceof Error);
            }
        }
    }).export(module);

    vows.describe('linq.takeWhile.map').addBatch({
        'Take while value < 5': {
            topic: linq({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 0 }).takeWhile(function (value, name) { return value < 5; }).run(),
            'Should return first 4 items': function (topic) {
                assert.deepEqual(topic, { a: 1, b: 2, c: 3, d: 4 });
            }
        },
        'Take while value < 0': {
            topic: linq({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 0 }).takeWhile(function (value, name) { return value < 0; }).run(),
            'Should return an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },
        'Take while value < 100': {
            topic: linq({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 0 }).takeWhile(function (value, name) { return value < 100; }).run(),
            'Should return the original map': function (topic) {
                assert.deepEqual(topic, { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 0 });
            }
        },
        'Take while name <= "e"': {
            topic: linq({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 0 }).takeWhile(function (value, name) { return name <= 'e'; }).run(),
            'Should return the first 5 items': function (topic) {
                assert.deepEqual(topic, { a: 1, b: 2, c: 3, d: 4, e: 5 });
            }
        },
        'Take while without predicate': {
            topic: linq({ a: 1, b: 2, c: 3, false: false, d: 4, e: 5, f: 6 }).takeWhile().run(),
            'Should return the first 3 items': function (topic) {
                assert.deepEqual(topic, { a: 1, b: 2, c: 3 });
            }
        },
        'Invalid predicate': {
            topic: function () {
                var callback = this.callback;

                linq({}).async.takeWhile('invalid').run(function (err) {
                    callback(null, err);
                });
            },
            'Should throws': function (topic) {
                assert(topic instanceof Error);
            }
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'));