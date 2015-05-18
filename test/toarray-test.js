!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.toArray.array').addBatch({
        'Converts an array to array without selector': {
            topic: linq([123, 456, 789]).toArray().run(),
            'Should returns copy of the first array': function (topic) {
                assert.deepEqual(topic, [123, 456, 789]);
            }
        },
        'Converts an array to array with a selector': {
            topic: linq([123, 456, 789]).toArray(function (value, index) { return index + '.' + value; }).run(),
            'Should similar to select clause': function (topic) {
                assert.deepEqual(topic, ['0.123', '1.456', '2.789']);
            }
        },
        'Converts an empty array to array': {
            topic: linq([]).toArray(assert.fail).run(),
            'Should returns an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Invalid selector': util.error(linq([]).toArray('invalid'), 'invalid selector')
    }).export(module);

    vows.describe('linq.toArray.map').addBatch({
        'Converts a map without selector': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).toArray().run(),
            'Should returns a key-value pair array': function (topic) {
                assert.deepEqual(topic, [
                    { name: 'abc', value: 123 },
                    { name: 'def', value: 456 },
                    { name: 'xyz', value: 789 },
                ]);
            }
        },
        'Converts a map with selector': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).toArray(function (value, name) { return name + '.' + value; }).run(),
            'Should returns a key-value pair array': function (topic) {
                assert.deepEqual(topic, ['abc.123', 'def.456', 'xyz.789']);
            }
        },
        'Converts an empty map': {
            topic: linq({}).toArray(assert.fail).run(),
            'Should returns an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },
        'Converts an unspecified map': {
            topic: linq().toArray(assert.fail).run(),
            'Should returns an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },
        'Invalid selector': util.error(linq({}).toArray('invalid'), 'invalid selector')
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));