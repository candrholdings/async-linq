!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.empty.array').addBatch({
        'When emptying an array with 3 items': {
            topic: linq([123, 456, 789]).empty().run(),
            'Should returns an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'When emptying an empty array': {
            topic: function () {
                var input = [],
                    output = linq(input).empty().run();

                this.callback(null, {
                    input: input,
                    output: output
                });
            },
            'Should returns an empty array': function (topic) {
                assert.deepEqual(topic.output, []);
            },
            'Should returns a new instance': function (topic) {
                assert.notEqual(topic.output, topic.input);
            }
        }
    }).export(module);

    vows.describe('linq.empty.map').addBatch({
        'When emptying a map with 3 items': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).empty().run(),
            'Should returns an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },
        'When emptying an empty map': {
            topic: function () {
                var input = {},
                    output = linq(input).empty().run();

                this.callback(null, {
                    input: input,
                    output: output
                });
            },
            'Should returns an empty map': function (topic) {
                assert.deepEqual(topic.output, {});
            },
            'Should returns a new instance': function (topic) {
                assert.notEqual(topic.output, topic.input);
            }
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));