!function (assert, vows, linq) {
    'use strict';

    vows.describe('linq.ofType.array').addBatch({
        'Filters an array of type "number"': {
            topic: linq([123, 'abc', true, 456, 'def', false, 789, 'xyz']).ofType('number').run(),
            'Should returns an array of only type "number"': function (topic) {
                assert.deepEqual(topic, [123, 456, 789]);
            }
        },
        'Filters an array of type "function"': {
            topic: function () {
                var a = function () {},
                    b = function () {},
                    c = function () {};

                return {
                    a: a,
                    b: b,
                    c: c,
                    output: linq([123, 'abc', true, a, 456, 'def', false, 789, b, 'xyz', c]).ofType('function').run()
                };
            },
            'Should returns an array of only type "function"': function (topic) {
                assert.deepEqual(topic.output, [topic.a, topic.b, topic.c]);
            }
        },
        'Filters an array with a custom type': {
            topic: function () {
                var a = new Date(),
                    b = new Date(),
                    c = new Date();

                return {
                    a: a,
                    b: b,
                    c: c,
                    output: linq([123, 'abc', true, a, 456, 'def', false, 789, b, 'xyz', c]).ofType(Date).run()
                };
            },
            'Should returns an array with items only of type Date': function (topic) {
                assert.deepEqual(topic.output, [topic.a, topic.b, topic.c]);
            }
        },
        'Filters an array without a type specified': {
            topic: linq([123, 'abc', true, 456, 'def', false, 789, 'xyz']).ofType().run(),
            'Should returns an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Filters an empty array': {
            topic: linq([]).ofType().run(),
            'Should returns an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        }
    }).export(module);

    vows.describe('linq.ofType.map').addBatch({
        'Filters a map of type "number"': {
            topic: linq({ n1: 123, s1: 'abc', b1: true, n2: 456, s2: 'def', b2: false, n3: 789, s3: 'xyz' }).ofType('number').run(),
            'Should returns a map of only type "number"': function (topic) {
                assert.deepEqual(topic, { n1: 123, n2: 456, n3: 789 });
            }
        },
        'Filters a map of type "function"': {
            topic: function () {
                var a = function () {},
                    b = function () {},
                    c = function () {};

                return {
                    a: a,
                    b: b,
                    c: c,
                    output: linq({ n1: 123, s1: 'abc', b1: true, f1: a, n2: 456, s2: 'def', b2: false, n3: 789, f2: b, s3: 'xyz', f3: c }).ofType('function').run()
                };
            },
            'Should returns a map of only type "function"': function (topic) {
                assert.deepEqual(topic.output, { f1: topic.a, f2: topic.b, f3: topic.c });
            }
        },
        'Filters a map with a custom type': {
            topic: function () {
                var a = new Date(),
                    b = new Date(),
                    c = new Date();

                return {
                    a: a,
                    b: b,
                    c: c,
                    output: linq({n1: 123, s1: 'abc', b1: true, d1: a, n2: 456, s2: 'def', b2: false, n3: 789, d2: b, s3: 'xyz', d3: c }).ofType(Date).run()
                };
            },
            'Should returns a map with items only of type Date': function (topic) {
                assert.deepEqual(topic.output, { d1: topic.a, d2: topic.b, d3: topic.c });
            }
        },
        'Filters a map without a type specified': {
            topic: linq({ n1: 123, s1: 'abc', b1: true, n2: 456, s2: 'def', b2: false, n3: 789, s3: 'xyz' }).ofType().run(),
            'Should returns an empty map': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Filters an empty map': {
            topic: linq({}).ofType().run(),
            'Should returns an empty map': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Filters an unspecified map': {
            topic: linq().ofType().run(),
            'Should returns an empty map': function (topic) {
                assert.deepEqual(topic, []);
            }
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'));