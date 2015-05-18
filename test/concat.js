!function (assert, vows, linq) {
    'use strict';

    vows.describe('linq.concat.array').addBatch({
        'Concatenating two with same values': {
            topic: linq([123, 456, 789]).concat([123, 456, 789]).run(),
            'Should get two array concatenated': function (topic) {
                assert.deepEqual(topic, [123, 456, 789, 123, 456, 789]);
            }
        },
        'Concatenating an array with a map': {
            topic: linq([123, 456, 789]).concat({ abc: 123, def: 456, xyz: 789 }).run(),
            'Should get an array with properties from map': function (topic) {
                var expected = [123, 456, 789];

                expected.abc = 123;
                expected.def = 456;
                expected.xyz = 789;

                assert.deepEqual(topic, expected);
            }
        },
        'Concatenating with empty': {
            topic: linq([123, 456, 789]).concat([]).run(),
            'Should get the original values': function (topic) {
                assert.deepEqual(topic, [123, 456, 789]);
            }
        },
        'Concatenating with undefined': {
            topic: linq([123, 456, 789]).concat().run(),
            'Should get the original values': function (topic) {
                assert.deepEqual(topic, [123, 456, 789]);
            }
        },
        'Concatenating empty': {
            topic: linq([]).concat([123, 456, 789]).run(),
            'Should get values from the latter': function (topic) {
                assert.deepEqual(topic, [123, 456, 789]);
            }
        }
    }).export(module);

    vows.describe('linq.concat.map').addBatch({
        'Concatenating two with some conflicting values': {
            topic: linq({ abc: 123, def: 456 }).concat({ def: 'DEF', xyz: 'XYZ' }).run(),
            'Should get a new map with properties preferred from latter': function (topic) {
                assert.deepEqual(topic, { abc: 123, def: 'DEF', xyz: 'XYZ' });
            }
        },
        'Concatenating a map with an array': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).concat([123, 456, 789]).run(),
            'Should get a map with indexed properties from an array': function (topic) {
                assert.deepEqual(topic, { abc: 123, def: 456, xyz: 789, '0': 123, '1': 456, '2': 789 });
            }
        },
        'Concatenating with empty': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).concat({}).run(),
            'Should get the original values': function (topic) {
                assert.deepEqual(topic, { abc: 123, def: 456, xyz: 789 });
            }
        },
        'Concatenating with undefined': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).concat().run(),
            'Should get the original values': function (topic) {
                assert.deepEqual(topic, { abc: 123, def: 456, xyz: 789 });
            }
        },
        'Concatenating empty': {
            topic: linq({}).concat({ abc: 123, def: 456, xyz: 789 }).run(),
            'Should get values from the latter': function (topic) {
                assert.deepEqual(topic, { abc: 123, def: 456, xyz: 789 });
            }
        },
        'Concatenating undefined': {
            topic: linq().concat({ abc: 123, def: 456, xyz: 789 }).run(),
            'Should get values from the latter': function (topic) {
                assert.deepEqual(topic, { abc: 123, def: 456, xyz: 789 });
            }
        },
        'Concatenating two undefined': {
            topic: linq().concat().run(),
            'Should get an undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'));