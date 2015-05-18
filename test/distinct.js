!function (assert, vows, linq) {
    'use strict';

    vows.describe('linq.distinct.array').addBatch({
        'Distinct an array without a hash function': {
            topic: linq([123, 456, 123, 789, 456, 789]).distinct().run(),
            'Should return an array distinct by its value': function (topic) {
                assert.deepEqual(topic, [123, 456, 789]);
            }
        },
        'Distinct an array with a hash function of mod 2': {
            topic: function () {
                return linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]).distinct(function (xValue, yValue, xIndex, yIndex) { return xValue % 2 === yValue % 2; }).run();
            },
            'Should return the first odd and even value': function (topic) {
                assert.deepEqual(topic, [1, 2]);
            }
        },
        'Distinct an array with a hash function of mod 2 of the index': {
            topic: linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]).distinct(function (xValue, yValue, xIndex, yIndex) { return xIndex % 2 === yIndex % 2; }).run(),
            'Should return the first and second value': function (topic) {
                assert.deepEqual(topic, [1, 2]);
            }
        },
        'Distinct an empty array': {
            topic: linq([]).distinct(assert.fail).run(),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Distinct an array of functions': {
            topic: function () {
                var a = function () {},
                    b = function () {},
                    c = function () {};

                return {
                    a: a,
                    b: b,
                    c: c,
                    output: linq([a, b, a, c, b, c]).distinct().run()
                };
            },
            'Should return an array distinct by its value': function (topic) {
                assert.deepEqual(topic.output, [topic.a, topic.b, topic.c]);
            }
        },
        'Invalid equality': {
            topic: function () {
                var callback = this.callback;

                linq([]).async.distinct('invalid').run(function (err) {
                    callback(null, err);
                });
            },
            'Should throws': function (topic) {
                assert(topic instanceof Error);
                assert.equal(topic.message, 'invalid equality');
            }
        }
    }).export(module);

    vows.describe('linq.distinct.map').addBatch({
        'Distinct an map without a hash function': {
            topic: linq({ abc: 123, def: 456, ABC: 123, xyz: 789, DEF: 456, XYZ: 789 }).distinct().run(),
            'Should return an map distinct by its value': function (topic) {
                assert.deepEqual(topic, { abc: 123, def: 456, xyz: 789 });
            }
        },
        'Distinct an map with a hash function of mod 2': {
            topic: function () {
                var odd = function () {},
                    even = function () {};

                return linq({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 0 }).distinct(function (xValue, yValue, xName, yName) { return xValue % 2 === yValue % 2; }).run();
            },
            'Should return the first odd and even value': function (topic) {
                assert.deepEqual(topic, { a: 1, b: 2 });
            }
        },
        'Distinct an map with a hash function of capitalization of name': {
            topic: linq({ a: 1, B: 2, c: 3, D: 4, e: 5, F: 6, g: 7, H: 8, i: 9, J: 0 }).distinct(function (xValue, yValue, xName, yName) { return (xName.toUpperCase() === xName) === (yName.toUpperCase() === yName); }).run(),
            'Should return the first value with uppercase and lowercase name respectively': function (topic) {
                assert.deepEqual(topic, { a: 1, B: 2 });
            }
        },
        'Distinct an empty map': {
            topic: linq({}).distinct(assert.fail).run(),
            'Should return an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },
        'Distinct an map of functions': {
            topic: function () {
                var a = function () {},
                    b = function () {},
                    c = function () {};

                return {
                    a: a,
                    b: b,
                    c: c,
                    output: linq({ a: a, b: b, A: a, c: c, B: b, C: c }).distinct().run()
                };
            },
            'Should return an array distinct by its value': function (topic) {
                assert.deepEqual(topic.output, { a: topic.a, b: topic.b, c: topic.c });
            }
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'));