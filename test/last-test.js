!function (assert, vows, linq, util) {
    'use strict';

    // Because "last" is implemented from "first", we wrote lesser tests here

    vows.describe('linq.last.array').addBatch({
        'Find the last odd number': {
            topic: function () {
                var array = [1, 2, 3, 4, 5, 6],
                    callback = this.callback;

                linq(array).async.last(function (value, index, callback) {
                    assert.equal(this, array);

                    callback(null, value % 2);
                }).run(function (err, result) {
                    callback(
                        null,
                        {
                            array: array,
                            result: result,
                            this: this
                        }
                    );
                });
            },
            'Should return 5': function (topic) {
                assert.equal(topic.result, 5);
            },
            'Should maintain "this"': function (topic) {
                assert.equal(topic.this, topic.array);
            },
            'Invalid predicate': util.error(linq([]).last('invalid'), 'invalid predicate')
        },
        'Find a missing value': {
            topic: function () {
                var array = [123, 456, 789],
                    callback = this.callback;

                linq(array).async.last(function (value, index, callback) {
                    assert.equal(this, array);

                    callback(null, value > 1000);
                }).run(function (err, result) {
                    callback(
                        null,
                        {
                            array: array,
                            err: err,
                            result: result,
                            this: this
                        }
                    );
                });
            },
            'Should not throw': function (topic) {
                assert(!topic.err);
            },
            'Should return undefined': function (topic) {
                assert.equal(typeof topic.result, 'undefined');
            },
            'Should maintain "this"': function (topic) {
                assert.equal(topic.this, topic.array);
            }
        }
    }).export(module);

    vows.describe('linq.last.map').addBatch({
        'Find the last odd number': {
            topic: function () {
                var map = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 },
                    callback = this.callback;

                linq(map).async.last(function (value, name, callback) {
                    assert.equal(this, map);

                    callback(null, value % 2);
                }).run(function (err, result) {
                    callback(
                        null,
                        {
                            map: map,
                            result: result,
                            this: this
                        }
                    );
                });
            },
            'Should return "e"': function (topic) {
                assert.equal(topic.result, 'e');
            },
            'Should maintain "this"': function (topic) {
                assert.equal(topic.this, topic.map);
            }
        },
        'Find a missing value': {
            topic: function () {
                var map = { abc: 123, def: 456, xyz: 789 },
                    callback = this.callback;

                linq(map).async.last(function (value, index, callback) {
                    assert.equal(this, map);

                    callback(null, value > 1000);
                }).run(function (err, result) {
                    callback(
                        null,
                        {
                            err: err,
                            map: map,
                            result: result,
                            this: this
                        }
                    );
                });
            },
            'Should not throw': function (topic) {
                assert(!topic.err);
            },
            'Should return undefined': function (topic) {
                assert.equal(typeof topic.result, 'undefined');
            },
            'Should maintain "this"': function (topic) {
                assert.equal(topic.this, topic.map);
            },
            'Invalid predicate': util.error(linq({}).last('invalid'), 'invalid predicate')
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));