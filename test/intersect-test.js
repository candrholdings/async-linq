!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.intersect.array').addBatch({
        'Intersecting two arrays with some duplicated entries': {
            topic: linq([1, 2, 3, 4, 5, 6, 7]).intersect([4, 5, 6, 7, 8, 9, 0]).run(),
            'Should returns an array with items exists on both arrays': function (topic) {
                assert.deepEqual(topic, [4, 5, 6, 7]);
            }
        },

        'Intersecting two arrays with no duplicated entries': {
            topic: linq([1, 2, 3, 4, 5]).intersect([6, 7, 8, 9, 0]).run(),
            'Should returns an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },

        'Intersecting an array with an empty array': {
            topic: linq([123, 456, 789]).intersect([]).run(),
            'Should returns an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },

        'Intersecting an array with an unspecified array': {
            topic: linq([123, 456, 789]).intersect().run(),
            'Should returns an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },

        'Intersecting an empty array with an array': {
            topic: linq([]).intersect([123, 456, 789]).run(),
            'Should returns an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },

        'Intersecting an array with a map': {
            topic: linq(['abc', 'def', 'xyz']).intersect({ abc: 123 }).run(),
            'Should returns an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },

        'Intersecting with a custom comparer': {
            topic: linq(['abc', 'def', 'xyz']).intersect(['ABC', 'XYZ'], function (leftValue, rightValue) { return leftValue.toUpperCase() === rightValue.toUpperCase(); }).run(),
            'Should returns intersecting elements': function (topic) {
                assert.deepEqual(topic, ['abc', 'xyz']);
            }
        },

        'Invalid comparer': util.error(linq([]).intersect([], 'invalid'), 'invalid comparer')
    }).export(module);

    vows.describe('linq.intersect.map').addBatch({
        'Intersecting two maps with some duplicated entries': {
            topic: linq({ abc: 123, def: 456 }).intersect({ def: 456, xyz: 789 }).run(),
            'Should returns a map with pairs exists on both maps, prefer the first value': function (topic) {
                assert.deepEqual(topic, { def: 456 });
            }
        },

        'Intersecting two arrays with no duplicated entries': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).intersect({ ABC: 123, DEF: 456, XYZ: 789 }).run(),
            'Should returns an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },

        'Intersecting an map with an empty map': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).intersect({}).run(),
            'Should returns an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },

        'Intersecting an map with an unspecified map': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).intersect().run(),
            'Should returns an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },

        'Intersecting an empty map with an map': {
            topic: linq({}).intersect({ abc: 123, def: 456, xyz: 789 }).run(),
            'Should returns an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },

        'Intersecting an unspecified map with an map': {
            topic: linq().intersect({ abc: 123, def: 456, xyz: 789 }).run(),
            'Should returns an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },

        'Intersecting an map with an array': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).intersect(['abc', 'def', 'xyz']).run(),
            'Should returns an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },

        'Intersecting with a custom comparer': {
            topic: linq({ abc: 'abc', def: 'def', xyz: 'xyz' }).intersect({ ABC: 'ABC', XYZ: 'XYZ' }, function (leftValue, rightValue, leftName, rightName) {
                return leftValue.toUpperCase() === rightValue.toUpperCase() && leftName.toUpperCase() === rightValue.toUpperCase();
            }).run(),
            'Should returns intersecting elements': function (topic) {
                assert.deepEqual(topic, { abc: 'abc', xyz: 'xyz' });
            }
        },

        'Invalid comparer': util.error(linq([]).intersect([], 'invalid'), 'invalid comparer')
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));