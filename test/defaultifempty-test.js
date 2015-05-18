!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.defaultIfEmpty.array').addBatch({
        'When applying to an array with items': {
            topic: function () {
                var array = [123, 456, 789],
                    output = linq(array).defaultIfEmpty('ABC').run();

                this.callback(null, {
                    array: array,
                    output: output
                });
            },
            'Should returns content of the input array': function (topic) {
                assert.deepEqual(topic.output, [123, 456, 789]);
            },
            'Should returns a new instance': function (topic) {
                assert.notEqual(topic.output, topic.array);
            }
        },
        'When applying to an empty array': {
            topic: linq([]).defaultIfEmpty('ABC').run(),
            'Should place a default value in a singleton collection': function (topic) {
                assert.deepEqual(topic, ['ABC']);
            }
        },
        'When applying to an empty array without a default value': {
            topic: linq([]).defaultIfEmpty().run(),
            'Should place an undefined value in a singleton collection': function (topic) {
                assert.deepEqual(topic, [undefined]);
            }
        }
    }).export(module);

    vows.describe('linq.defaultIfEmpty.map').addBatch({
        'When applying to a map with items': {
            topic: function () {
                var map = { abc: 123, def: 456, xyz: 789 },
                    output = linq(map).defaultIfEmpty({ ABC: 'abc' }).run();

                this.callback(null, {
                    map: map,
                    output: output
                });
            },
            'Should returns content of the input array': function (topic) {
                assert.deepEqual(topic.output, { abc: 123, def: 456, xyz: 789 });
            },
            'Should returns a new instance': function (topic) {
                assert.notEqual(topic.output, topic.array);
            }
        },
        'When applying to an empty map': {
            topic: function () {
                var defaultValue = { ABC: 'abc', DEF: 'def', XYZ: 'xyz' },
                    output = linq({}).defaultIfEmpty(defaultValue).run();

                this.callback(null, {
                    defaultValue: defaultValue,
                    output: output
                });
            },
            'Should place a default value in a singleton collection': function (topic) {
                assert.deepEqual(topic.output, { ABC: 'abc', DEF: 'def', XYZ: 'xyz' });
            },
            'Should returns a new instance': function (topic) {
                assert.notEqual(topic.output, topic.defaultValue);
            }
        },
        'When applying to an empty map without a default value': {
            topic: linq({}).defaultIfEmpty().run(),
            'Should returns an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },
        'When applying to an unspecified map without a default value': {
            topic: linq({}).defaultIfEmpty().run(),
            'Should returns an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));