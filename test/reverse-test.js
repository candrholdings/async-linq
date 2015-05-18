!function (assert, vows, linq) {
    'use strict';

    vows.describe('linq.reverse.array').addBatch({
        'Reverse an array': {
            topic: function () {
                var input = [123, 456, 789];

                return {
                    input: input,
                    output: linq(input).reverse().run()
                };
            },
            'Should reverse an array': function (topic) {
                assert.deepEqual(topic.output, [789, 456, 123]);
            },
            'Should leave input array untouched': function (topic) {
                assert.deepEqual(topic.input, [123, 456, 789]);
            }
        },
        'Reverse an empty array': {
            topic: linq([]).reverse().run(),
            'Should return an empty array': function (topic) {
                assert.deepEqual([], topic);
            }
        }
    }).export(module);

    vows.describe('linq.reverse.map').addBatch({
        'Reverse a map': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).reverse().run(),
            'Should reverse a map': function (topic) {
                assert.deepEqual(topic, { xyz: 789, def: 456, abc: 123 });
            }
        },
        'Reverse an empty map': {
            topic: linq({}).reverse().run(),
            'Should return an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },
        'Reverse an undefined map': {
            topic: linq().reverse().run(),
            'Should return an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'));