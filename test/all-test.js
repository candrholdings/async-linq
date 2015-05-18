!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.all.array').addBatch({
        'Checks that all items are true to predicate': {
            topic: function () {
                var numTraversed = 0,
                    output = linq([123, 456, 789]).all(function (value, index) {
                        ++numTraversed;

                        return (index === 0 && value === 123) ||
                               (index === 1 && value === 456) ||
                               (index === 2 && value === 789);
                    }).run();

                this.callback(null, {
                    numTraversed: numTraversed,
                    output: output
                });
            },
            'Should traverse all items': function (topic) {
                assert.equal(topic.numTraversed, 3);
            },
            'Should return true': function (topic) {
                assert.equal(topic.output, true);
            }
        },
        'Checks that not all items are true to predicate': {
            topic: function () {
                var numTraversed = 0,
                    output = linq([123, 456, 789, 'abc']).all(function (value) { ++numTraversed; return typeof value === 'number'; }).run();

                this.callback(null, {
                    numTraversed: numTraversed,
                    output: output
                });
            },
            'Should traverse 4 items': function (topic) {
                assert.equal(topic.numTraversed, 4);
            },
            'Should return false': function (topic) {
                assert.equal(topic.output, false);
            }
        },
        'Checks without falsy value': {
            topic: linq([123, 456, 789]).all().run(),
            'Should return true': function (topic) {
                assert.equal(topic, true);
            }
        },
        'Checks with some falsy values': {
            topic: linq([123, undefined, 456, 789]).all().run(),
            'Should return false': function (topic) {
                assert.equal(topic, false);
            }
        },
        'Checks empty': {
            topic: linq([]).all(assert.fail).run(),
            'Should return true': function (topic) {
                assert.equal(topic, true);
            }
        },
        'Invalid predicate': util.error(linq([]).all('invalid'), 'invalid predicate')
    }).export(module);

    vows.describe('linq.all.map').addBatch({
        'Checks that all items are true to predicate': {
            topic: function () {
                var numTraversed = 0,
                    output = linq({ abc: 123, def: 456, xyz: 789 }).all(function (value, name) {
                        ++numTraversed;

                        return (name === 'abc' && value === 123) ||
                               (name === 'def' && value === 456) ||
                               (name === 'xyz' && value === 789);
                    }).run();

                this.callback(null, {
                    numTraversed: numTraversed,
                    output: output
                });
            },
            'Should traverse all items': function (topic) {
                assert.equal(topic.numTraversed, 3);
            },
            'Should return true': function (topic) {
                assert.equal(topic.output, true);
            }
        },
        'Checks that not all items are true to predicate': {
            topic: function () {
                var numTraversed = 0,
                    output = linq({ abc: 123, def: 456, xyz: 789, ABC: 'abc' }).all(function (value) { ++numTraversed; return typeof value === 'number'; }).run();

                this.callback(null, {
                    numTraversed: numTraversed,
                    output: output
                });
            },
            'Should traverse 4 items': function (topic) {
                assert.equal(topic.numTraversed, 4);
            },
            'Should return false': function (topic) {
                assert.equal(topic.output, false);
            }
        },
        'Checks without falsy value': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).all().run(),
            'Should return true': function (topic) {
                assert.equal(topic, true);
            }
        },
        'Checks with some falsy values': {
            topic: linq({ abc: 123, u: undefined, def: 456, xyz: 789 }).all().run(),
            'Should return false': function (topic) {
                assert.equal(topic, false);
            }
        },
        'Checks empty': {
            topic: linq({}).all(assert.fail).run(),
            'Should return true': function (topic) {
                assert.equal(topic, true);
            }
        },
        'Checks undefined': {
            topic: linq().all(assert.fail).run(),
            'Should return true': function (topic) {
                assert.equal(topic, true);
            }
        },
        'Invalid predicate': util.error(linq({}).all('invalid'), 'invalid predicate')
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));