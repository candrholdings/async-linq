!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.any.array').addBatch({
        'Finds any even number in an array': {
            topic: function () {
                var numTraversed = 0,
                    output = linq([123, 456, 789]).any(function (value, index) { ++numTraversed; return index + '.' + value === '1.456'; }).run();

                this.callback(null, {
                    numTraversed: numTraversed,
                    output: output
                });
            },
            'Should traverse only first two item': function (topic) {
                assert.equal(topic.numTraversed, 2);
            },
            'Should return true': function (topic) {
                assert.equal(topic.output, true);
            }
        },
        'Finds no item in an array': {
            topic: function () {
                var numTraversed = 0,
                    output = linq([123, 456, 789]).any(function (value) { ++numTraversed; return value > 1000; }).run();

                this.callback(null, {
                    numTraversed: numTraversed,
                    output: output
                });
            },
            'Should traverse every item': function (topic) {
                assert.equal(topic.numTraversed, 3);
            },
            'Should return false': function (topic) {
                assert.equal(topic.output, false);
            }
        },
        'Finds in an array without any predicate': {
            topic: linq([123, 456, 789]).any().run(),
            'Should return true': function (topic) {
                assert.equal(topic, true);
            }
        },
        'Finds in an empty array': {
            topic: linq([]).any(assert.fail).run(),
            'Should return false': function (topic) {
                assert.equal(topic, false);
            }
        },
        'Invalid predicate': util.error(linq([]).any('invalid'), 'invalid predicate')
    }).export(module);

    vows.describe('linq.any.map').addBatch({
        'Finds any even number in a map': {
            topic: function () {
                var numTraversed = 0,
                    output = linq({ abc: 123, def: 456, xyz: 789 }).any(function (value, name) { ++numTraversed; return name + '.' + value === 'def.456'; }).run();

                this.callback(null, {
                    numTraversed: numTraversed,
                    output: output
                });
            },
            'Should traverse only first two item': function (topic) {
                assert.equal(topic.numTraversed, 2);
            },
            'Should return true': function (topic) {
                assert.equal(topic.output, true);
            }
        },
        'Finds no item in a map': {
            topic: function () {
                var numTraversed = 0,
                    output = linq({ abc: 123, def: 456, xyz: 789 }).any(function (value) { ++numTraversed; return value > 1000; }).run();

                this.callback(null, {
                    numTraversed: numTraversed,
                    output: output
                });
            },
            'Should traverse every item': function (topic) {
                assert.equal(topic.numTraversed, 3);
            },
            'Should return false': function (topic) {
                assert.equal(topic.output, false);
            }
        },
        'Finds in a map without any predicate': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).any().run(),
            'Should return true': function (topic) {
                assert.equal(topic, true);
            }
        },
        'Finds in an empty map': {
            topic: linq({}).any(assert.fail).run(),
            'Should return false': function (topic) {
                assert.equal(topic, false);
            }
        },
        'Finds in an undefined map': {
            topic: linq().any(assert.fail).run(),
            'Should return false': function (topic) {
                assert.equal(topic, false);
            }
        },
        'Invalid predicate': util.error(linq({}).any('invalid'), 'invalid predicate')
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));