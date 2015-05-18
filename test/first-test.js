!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.first.array').addBatch({
        'Finds the first even number in an array': {
            topic: function () {
                var numTraversed = 0,
                    output = linq([123, 456, 789]).first(function (value) { ++numTraversed; return !(value % 2); }).run();

                return {
                    numTraversed: numTraversed,
                    output: output
                };
            },
            'Should return index of the first even number': function (topic) {
                assert.equal(topic.output, 1);
            },
            'Should traverse only first two items': function (topic) {
                assert.equal(topic.numTraversed, 2);
            }
        },
        'Finds a missing value in an array': {
            topic: function () {
                var numTraversed = 0,
                    output = linq([123, 456, 789]).first(function (value) { ++numTraversed; return value > 1000; }).run();

                this.callback(null, { numTraversed: numTraversed, output: output });
            },
            'Should return undefined': function (topic) {
                assert.equal(typeof topic.output, 'undefined');
            },
            'Should traverse every element in the array': function (topic) {
                assert.equal(topic.numTraversed, 3);
            }
        },
        'Finds the second element in an array': {
            topic: function () {
                var numTraversed = 0,
                    output = linq([123, 456, 789]).first(function (value, index) { ++numTraversed; return index === 1; }).run();

                return {
                    numTraversed: numTraversed,
                    output: output
                };
            },
            'Should return 1': function (topic) {
                assert.equal(topic.output, 1);
            },
            'Should traverse only first two items': function (topic) {
                assert.equal(topic.numTraversed, 2);
            }
        },
        'Finds in an array without a predicate': {
            topic: linq([undefined, null, false, 1]).first().run(),
            'Should return index of the first truthy value': function (topic) {
                assert.equal(topic, 3);
            }
        },
        'Finds a missing value in an array without a predicate': {
            topic: linq([undefined, null, false]).first().run(),
            'Should return undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        },
        'Finds any item in an empty array': {
            topic: linq([]).first(assert.fail).run(),
            'Should return undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        },
        'Invalid predicate': util.error(linq([]).first('invalid'), 'invalid predicate')
    }).export(module);

    vows.describe('linq.first.map').addBatch({
        'Finds the first even number in a map': {
            topic: function () {
                var numTraversed = 0,
                    output = linq({ abc: 123, def: 456, xyz: 789 }).first(function (value) { ++numTraversed; return !(value % 2); }).run();

                return {
                    numTraversed: numTraversed,
                    output: output
                };
            },
            'Should return the name of the first even number': function (topic) {
                assert.equal(topic.output, 'def');
            },
            'Should traverse only first two items': function (topic) {
                assert.equal(topic.numTraversed, 2);
            }
        },
        'Finds a missing value in a map': {
            topic: function () {
                var numTraversed = 0,
                    output = linq({ abc: 123, def: 456, xyz: 789 }).first(function (value) { ++numTraversed; return value > 1000; }).run();

                this.callback(null, { numTraversed: numTraversed, output: output });
            },
            'Should return undefined': function (topic) {
                assert.equal(typeof topic.output, 'undefined');
            },
            'Should traverse every element in the map': function (topic) {
                assert.equal(topic.numTraversed, 3);
            }
        },
        'Finds the element named "def" in a map': {
            topic: function () {
                var numTraversed = 0,
                    output = linq({ abc: 123, def: 456, xyz: 789 }).first(function (value, name) { ++numTraversed; return name === 'def'; }).run();

                return {
                    numTraversed: numTraversed,
                    output: output
                };
            },
            'Should return "def"': function (topic) {
                assert.equal(topic.output, 'def');
            },
            'Should traverse only first two items': function (topic) {
                assert.equal(topic.numTraversed, 2);
            }
        },
        'Finds in a map without a predicate': {
            topic: linq({ u: undefined, n: null, b: false, number: 1 }).first().run(),
            'Should return index of the first truthy value': function (topic) {
                assert.equal(topic, 'number');
            }
        },
        'Finds a missing value in a map without a predicate': {
            topic: linq({ u: undefined, n: null, b: false }).first().run(),
            'Should return "undefined"': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        },
        'Finds any item in an empty map': {
            topic: linq({}).first(assert.fail).run(),
            'Should return "undefined"': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        },
        'Finds any item in an unspecified map': {
            topic: linq().first(assert.fail).run(),
            'Should return "undefined"': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        },
        'Invalid predicate': util.error(linq({}).first('invalid'), 'invalid predicate')
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));