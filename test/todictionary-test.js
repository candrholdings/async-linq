!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.toDictionary.array').addBatch({
        'Converts an array into a map without a key selector': {
            topic: linq([123, 456, 789]).toDictionary().run(),
            'Should returns a map with index as name': function (topic) {
                assert.deepEqual(topic, { '0': 123, '1': 456, '2': 789 });
            }
        },
        'Converts an array into a map with a key selector': {
            topic: linq([123, 456, 789]).toDictionary(function (value, index) { return index + '.' + value; }).run(),
            'Should returns a map with custom name': function (topic) {
                assert.deepEqual(topic, {
                    '0.123': 123,
                    '1.456': 456,
                    '2.789': 789
                });
            }
        },
        'Converts an array into a map with a key selector that returns undefined or null': {
            topic: linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]).toDictionary(function (value, index) { return [undefined, index, null, index, false, index, index, index, index, index][index] }).run(),
            'Should returns a map with custom name and not all items': function (topic) {
                assert.deepEqual(topic, {
                    '1': 2,
                    '3': 4,
                    '5': 6,
                    '6': 7,
                    '7': 8,
                    '8': 9,
                    '9': 0
                });
            }
        },
        'Converts an empty array': {
            topic: linq([]).toDictionary(assert.fail).run(),
            'Should returns an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },
        'Invalid key selector': util.error(linq([]).toDictionary('invalid'), 'invalid keySelector')
    }).export(module);

    vows.describe('linq.toDictionary.map').addBatch({
        'Converts a map into another map without a key selector': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).toDictionary().run(),
            'Should returns a map with same name of original pair': function (topic) {
                assert.deepEqual(topic, { abc: { abc: 123 }, def: { def: 456 }, xyz: { xyz: 789 } });
            }
        },
        'Converts a map into another map with a key selector': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).toDictionary(function (value, name) { return name + '.' + value; }).run(),
            'Should returns a map with custom name': function (topic) {
                assert.deepEqual(topic, {
                    'abc.123': { abc: 123 },
                    'def.456': { def: 456 },
                    'xyz.789': { xyz: 789 }
                });
            }
        },
        'Converts an empty map': {
            topic: linq({}).toDictionary(assert.fail).run(),
            'Should returns an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },
        'Converts an unspecified map': {
            topic: linq().toDictionary(assert.fail).run(),
            'Should returns an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },
        'Invalid key selector': util.error(linq({}).toDictionary('invalid'), 'invalid keySelector')
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));