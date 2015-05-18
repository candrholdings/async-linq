!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.contains.array').addBatch({
        'Find if an array contains a value': {
            topic: function () {
                var numCalled = 0,
                    output =
                        linq([200, 304, 404, 500])
                            .contains(
                                400,
                                function (left, right) {
                                    numCalled++;

                                    return ~~(left / 100) === ~~(right / 100);
                                }
                            )
                            .run();

                this.callback(null, {
                    output: output,
                    numCalled: numCalled
                });
            },
            'Should return true': function (topic) {
                assert.equal(topic.output, true);
            },
            'Should call comparer 3 times only': function (topic) {
                assert.equal(topic.numCalled, 3);
            }
        },
        'Find if an array contains a value without equality comparer': {
            topic: linq([200, 304, 404]).contains(400).run(),
            'Should return false': function (topic) {
                assert.equal(topic, false);
            }
        },
        'Find in an empty array': {
            topic: linq([]).contains(400).run(),
            'Should return false': function (topic) {
                assert.equal(topic, false);
            }
        },
        'Invalid comparer': util.error(linq([]).contains(0, 'invalid'), 'invalid comparer')
    }).export(module);

    vows.describe('linq.contains.map').addBatch({
        'Find if an array contains a value': {
            topic: function () {
                var numCalled = 0,
                    output =
                        linq({ ok: 200, redirect: 304, notFound: 404, serverError: 500 })
                            .contains(
                                400,
                                function (xValue, yValue, xName) {
                                    numCalled++;

                                    return ~~(xValue / 100) === ~~(yValue / 100);
                                }
                            )
                            .run();

                this.callback(null, {
                    output: output,
                    numCalled: numCalled
                });
            },
            'Should return true': function (topic) {
                assert.equal(topic.output, true);
            },
            'Should call comparer 3 times only': function (topic) {
                assert.equal(topic.numCalled, 3);
            }
        },
        'Find if an array contains a value without equality comparer': {
            topic: linq({ ok: 200, redirect: 304, notFound: 404, serverError: 500 }).contains(400).run(),
            'Should return false': function (topic) {
                assert.equal(topic, false);
            }
        },
        'Find in an empty array': {
            topic: linq({}).contains(400).run(),
            'Should return false': function (topic) {
                assert.equal(topic, false);
            }
        },
        'Invalid comparer': util.error(linq({}).contains(0, 'invalid'), 'invalid comparer')
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));