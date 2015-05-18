!function (assert, linq) {
    'use strict';

    require('vows').describe('linq.where.array').addBatch({
        'When filtering only odd numbers with 123, 456, 789': {
            topic: linq([123, 456, 789]).where(function (v) { return v % 2; }).run(),
            'should return odd numbers only': function (topic) {
                assert.deepEqual(topic, [123, 789]);
            }
        },

        'When filtering an empty array': {
            topic: linq([]).where(function () { assert.fail(); }).run(),
            'should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },

        'When filtering with an invalid predicate': {
            topic: function () {
                var callback = this.callback;

                linq([]).async.where('invalid').run(function (err) {
                    callback(null, err);
                });
            },
            'Should throws an error': function (topic) {
                assert(topic instanceof Error);
            }
        }
    }).export(module);

    require('vows').describe('linq.where.map').addBatch({
        'When filtering only odd numbers with { abc: 123, def: 456, xyz: 789 }': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).where(function (value, name) { return value % 2; }).run(),
            'should return odd numbers only': function (topic) {
                assert.deepEqual(topic, { abc: 123, xyz: 789 });
            }
        },

        'When filtering an empty map': {
            topic: linq({}).where(function () { assert.fail(); }).run(),
            'should return an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },

        'When filtering with an invalid predicate': {
            topic: function () {
                var callback = this.callback;

                linq({}).async.where('invalid').run(function (err) {
                    callback(null, err);
                });
            },
            'Should throws an error': function (topic) {
                assert(topic instanceof Error);
            }
        }
    }).export(module);

    require('vows').describe('linq.async.where.array').addBatch({
        'When filtering only odd numbers with 123, 456, 789': {
            topic: function () {
                linq([123, 456, 789]).async.where(function (value, index, callback) { callback(null, value % 2); }).run(this.callback);
            },
            'should return odd numbers only': function (topic) {
                assert.deepEqual(topic, [123, 789]);
            }
        },

        'When filtering an empty array': {
            topic: function () {
                linq([]).async.where(function () { assert.fail(); }).run(this.callback);
            },
            'should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        }
    }).export(module);

    require('vows').describe('linq.async.where.map').addBatch({
        'When filtering only odd numbers with { abc: 123, def: 456, xyz: 789 }': {
            topic: function () {
                linq({ abc: 123, def: 456, xyz: 789 }).async.where(function (value, name, callback) { callback(null, value % 2); }).run(this.callback);
            },
            'should return odd numbers only': function (topic) {
                assert.deepEqual(topic, { abc: 123, xyz: 789 });
            }
        },

        'When filtering an empty map': {
            topic: function () {
                linq({}).async.where(function () { assert.fail(); }).run(this.callback);
            },
            'should return an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        }
    }).export(module);
}(
    require('assert'),
    require('../linq3')
);