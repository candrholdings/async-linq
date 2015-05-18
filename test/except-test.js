!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.except.array').addBatch({
        'Excepts first array from second array with intersecting values': {
            topic: linq([123, 456, 789]).except([456]).run(),
            'Should select correct values': function (topic) {
                assert.deepEqual(topic, [123, 789]);
            }
        },
        'Excepts first array from second array of no intersecting values': {
            topic: linq([123, 456, 789]).except(['abc', 'def', 'xyz']).run(),
            'Should returns the first array': function (topic) {
                assert.deepEqual(topic, [123, 456, 789]);
            }
        },
        'Excepts first array from an empty array': {
            topic: linq([123, 456, 789]).except([]).run(),
            'Should returns the first array': function (topic) {
                assert.deepEqual(topic, [123, 456, 789]);
            }
        },
        'Excepts first array from an unspecified array': {
            topic: linq([123, 456, 789]).except().run(),
            'Should returns the first array': function (topic) {
                assert.deepEqual(topic, [123, 456, 789]);
            }
        },
        'Excepts an empty array with another array': {
            topic: linq([]).except([123, 456, 789]).run(),
            'Should returns an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Excepts an array with a map': {
            topic: linq([123, 456, 789]).except({ def: 456 }).run(),
            'Should returns an array without values from second map': function (topic) {
                assert.deepEqual(topic, [123, 789]);
            }
        },
        'Excepts two array with a custom comparer': {
            topic: linq([200, 304, 404, 500]).except([300, 400], function (leftValue, rightValue) { return ~~(leftValue / 100) === ~~(rightValue / 100); }).run(),
            'Should returns an array without values from second array': function (topic) {
                assert.deepEqual(topic, [200, 500]);
            }
        },
        'Invalid comparer': util.error(linq([]).except([], 'invalid'), 'invalid comparer')
    }).export(module);

    vows.describe('linq.except.map').addBatch({
        'Excepts first map from second map with intersecting names and values': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).except({ def: 456 }).run(),
            'Should select correct values': function (topic) {
                assert.deepEqual(topic, { abc: 123, xyz: 789 });
            }
        },
        'Excepts first map from second map of no intersecting values': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).except({ ABC: '123', DEF: '456', XYZ: '789' }).run(),
            'Should returns the first map': function (topic) {
                assert.deepEqual(topic, { abc: 123, def: 456, xyz: 789 });
            }
        },
        'Excepts first map from an empty map': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).except({}).run(),
            'Should returns the first map': function (topic) {
                assert.deepEqual(topic, { abc: 123, def: 456, xyz: 789 });
            }
        },
        'Excepts first map from an unspecified map': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).except().run(),
            'Should returns the first map': function (topic) {
                assert.deepEqual(topic, { abc: 123, def: 456, xyz: 789 });
            }
        },
        'Excepts an empty map with another map': {
            topic: linq({}).except({ abc: 123, def: 456, xyz: 789 }).run(),
            'Should returns an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },
        'Excepts an unspecified map with another map': {
            topic: linq({}).except({ abc: 123, def: 456, xyz: 789 }).run(),
            'Should returns an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },
        'Excepts a map with an array': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).except([123, 456, 789]).run(),
            'Should returns the first map': function (topic) {
                assert.deepEqual(topic, { abc: 123, def: 456, xyz: 789 });
            }
        },
        'Invalid comparer': util.error(linq({}).except({}, 'invalid'), 'invalid comparer')
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));