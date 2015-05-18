!function (assert, vows, linq) {
    'use strict';

    linq.fn.throw = function (callback) {
        throw new Error('expected');
    };

    linq.fn.error = function (callback) {
        callback(new Error('expected'));
    };

    vows.describe('linq exception handling').addBatch({
        'When exception in sync clause': {
            topic: function () {
                var callback = this.callback;

                assert.throws(function () {
                    linq([123, 456, 789]).where(function () { throw new Error('expected'); }).run();
                }, Error);

                callback();
            },
            'Should throw': function (topic) {}
        },

        'When exception in async clause': {
            topic: function () {
                var callback = this.callback;

                linq([123, 456, 789]).async.where(function (value, index, callback) { throw new Error('expected'); }).run(function (err) {
                    assert(err);
                    assert.equal(err.message, 'expected');

                    callback();
                });
            },
            'Should pass as err': function (topic) {}
        },

        'When err in async clause': {
            topic: function () {
                var callback = this.callback;

                linq([123, 456, 789]).async.where(function (value, index, callback) { callback(new Error('expected')); }).run(function (err) {
                    assert(err);
                    assert.equal(err.message, 'expected');

                    callback();
                });
            },
            'Should pass as err': function (topic) {}
        },

        'When exception in custom sync clause': {
            topic: function () {
                var callback = this.callback;

                assert.throws(function () {
                    linq([123, 456, 789]).throw().run();
                }, Error);

                callback();
            },
            'Should throw': function (topic) {}
        },

        'When error in custom sync clause': {
            topic: function () {
                var callback = this.callback;

                assert.throws(function () {
                    linq([123, 456, 789]).error().run();
                }, Error);

                callback();
            },
            'Should throw': function (topic) {}
        },

        'When exception in custom async clause': {
            topic: function () {
                var callback = this.callback;

                linq([123, 456, 789]).async.throw().run(function (err) {
                    assert(err);
                    assert.equal(err.message, 'expected');

                    callback();
                });
            },
            'Should pass as err': function (topic) {}
        },

        'When error in custom async clause': {
            topic: function () {
                var callback = this.callback;

                linq([123, 456, 789]).async.error().run(function (err) {
                    assert(err);
                    assert.equal(err.message, 'expected');

                    callback();
                });
            },
            'Should pass as err': function (topic) {}
        }
    }).export(module);
}(
    require('assert'),
    require('vows'),
    require('../linq3')
);