!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.union.array').addBatch({
        'Unite two arrays without duplicated items': {
            topic: linq([123, 456, 789]).union(['abc', 'def', 'xyz']).run(),
            'Should returns two array concatenated': function (topic) {
                assert.deepEqual(topic, [123, 456, 789, 'abc', 'def', 'xyz']);
            }
        },
        'Unite two arrays with duplicated and non-string items': {
            topic: function () {
                var a = function () {},
                    b = function () {},
                    c = function () {};

                return {
                    a: a,
                    b: b,
                    c: c,
                    output: linq([a, b]).union([b, c]).run()
                };
            },
            'Should returns a concatenated but distinct array': function (topic) {
                assert.deepEqual(topic.output, [topic.a, topic.b, topic.c]);
            }
        },
        'Unite two arrays with custom comparer': {
            topic: linq(['abc123', 'def456', 'xyz789']).union(['abc', 'def', 'xyz', 'ABC', 'DEF', 'XYZ'], function (leftValue, rightValue, leftIndex, rightIndex) { return leftValue.substr(0, 3) === rightValue; }).run(),
            'Should returns an array of 6 elements': function (topic) {
                assert.deepEqual(topic, ['abc123', 'def456', 'xyz789', 'ABC', 'DEF', 'XYZ']);
            }
        },
        'Unite an array with an empty array': {
            topic: linq([123, 456, 789]).union([]).run(),
            'Should returns the first array': function (topic) {
                assert.deepEqual(topic, [123, 456, 789]);
            }
        },
        'Unite an array with an unspecified array': {
            topic: linq([123, 456, 789]).union().run(),
            'Should returns the first array': function (topic) {
                assert.deepEqual(topic, [123, 456, 789]);
            }
        },
        'Unite an empty array with another array': {
            topic: linq([]).union([123, 456, 789]).run(),
            'Should returns the second array': function (topic) {
                assert.deepEqual(topic, [123, 456, 789]);
            }
        },
        'Unite an array with a map': {
            topic: linq([123, 456, 789]).union({ abc: 12300, def: 45600, xyz: 78900 }).run(),
            'Should returns an array with properties from the map': function (topic) {
                var expected = [123, 456, 789];

                expected.abc = 12300;
                expected.def = 45600;
                expected.xyz = 78900;

                assert.deepEqual(topic, expected);
            }
        },
        'Invalid comparer': util.error(linq([]).union([], 'invalid'), 'invalid comparer')
    }).export(module);

    vows.describe('linq.union.map').addBatch({
        'Unite two maps without duplicated items': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).union({ ABC: 123, DEF: 456, XYZ: 789 }).run(),
            'Should returns two map concatenated': function (topic) {
                assert.deepEqual(topic, { abc: 123, def: 456, xyz: 789, ABC: 123, DEF: 456, XYZ: 789 });
            }
        },
        'Unite two maps with duplicated names': {
            topic: linq({ abc: 123, def: 456 }).union({ def: '456', xyz: '789' }).run(),
            'Should returns a new map with properties preferred from second map': function (topic) {
                assert.deepEqual(topic, { abc: 123, def: '456', xyz: '789' });
            }
        },
        'Unite a map with an empty map': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).union({}).run(),
            'Should returns the first map': function (topic) {
                assert.deepEqual(topic, { abc: 123, def: 456, xyz: 789 });
            }
        },
        'Unite an array with an unspecified array': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).union().run(),
            'Should returns the first map': function (topic) {
                assert.deepEqual(topic, { abc: 123, def: 456, xyz: 789 });
            }
        },
        'Unite an empty array with another array': {
            topic: linq({}).union({ abc: 123, def: 456, xyz: 789 }).run(),
            'Should returns the second map': function (topic) {
                assert.deepEqual(topic, { abc: 123, def: 456, xyz: 789 });
            }
        },
        'Unite an unspecified array with another array': {
            topic: linq().union({ abc: 123, def: 456, xyz: 789 }).run(),
            'Should returns the second map': function (topic) {
                assert.deepEqual(topic, { abc: 123, def: 456, xyz: 789 });
            }
        },
        'Unite a map with an array': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).union([123, 456, 789]).run(),
            'Should returns an array with properties from first map': function (topic) {
                assert.deepEqual(topic, { abc: 123, def: 456, xyz: 789, '0': 123, '1': 456, '2': 789 });
            }
        },
        'Unite with custom comparer': {
            topic: linq({ abc: 123, def: 456 }).union({ abc: 'abc123', def: 'def456', xyz: 'xyz789' }, function (leftValue, rightValue, leftName, rightName) { return leftName === rightName; }).run(),
            'Should unify two arrays': function (topic) {
                assert.deepEqual(topic, { abc: 123, def: 456, xyz: 'xyz789' });
            }
        },
        'Invalid comparer': util.error(linq({}).union({}, 'invalid'), 'invalid comparer')
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));