!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.bug').addBatch({
        'Map mixing where/select should returns a map': {
            topic: linq({ abc: 123, def: 456, xyz: 789 })
                       .where(function (t) {
                           return 1;
                       })
                       .select(function (value, name) {
                           return value;
                       }, function (value, name) {
                           return name;
                       })
                       .run(),
            'Should return the target item': function (topic) {
                assert.deepEqual(topic, { abc: 123, def: 456, xyz: 789 });
            }
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));