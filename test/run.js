!function (assert, linq) {
    'use strict';

    require('vows').describe('linq.run.array').addBatch({
        'when run without any clauses': {
            topic: function () {
                return linq([123, 456, 789]).run();
            },
            'should return original array': function (topic) {
                assert.deepEqual([123, 456, 789], topic);
            }
        }
    }).export(module);

    require('vows').describe('linq.run.map').addBatch({
        'when run without any clauses': {
            topic: function () {
                return linq({ abc: 123, def: 456, xyz: 789 }).run();
            },
            'should return original map': function (topic) {
                assert.deepEqual({ abc: 123, def: 456, xyz: 789 }, topic);
            }
        }
    }).export(module);

    require('vows').describe('linq.async.run.array').addBatch({
        'when run without any clauses': {
            topic: function () {
                linq([123, 456, 789]).async.run(this.callback);
            },
            'should return original array': function (topic) {
                assert.deepEqual([123, 456, 789], topic);
            }
        }
    }).export(module);

    require('vows').describe('linq.async.run.map').addBatch({
        'when run without any clauses': {
            topic: function () {
                linq({ abc: 123, def: 456, xyz: 789 }).async.run(this.callback);
            },
            'should return original map': function (topic) {
                assert.deepEqual({ abc: 123, def: 456, xyz: 789 }, topic);
            }
        }
    }).export(module);
}(
    require('assert'),
    require('../linq3')
);