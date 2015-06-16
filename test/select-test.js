!function (assert, linq) {
    'use strict';

    require('vows').describe('linq.select.array').addBatch({
        'When selecting [123, 456, 789] by multplying 10': {
            topic: linq([123, 456, 789]).select(function (value, index) { return index + '.' + value; }).run(),
            'Should return ["0.123", "1.456", "2.789"]': function (topic) {
                assert.deepEqual(topic, ['0.123', '1.456', '2.789']);
            }
        },

        'When selecting an empty array': {
            topic: linq([]).select(assert.fail).run(),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },

        'When selecting with an invalid selector': {
            topic: function () {
                var callback = this.callback;

                linq([]).async.select('invalid').run(function (err) {
                    callback(null, err);
                });
            },
            'Should throws': function (topic) {
                assert(topic instanceof Error);
            }
        }
    }).export(module);

    require('vows').describe('linq.select.map').addBatch({
        'When selecting { abc: 123, def: 456, xyz: 789 } by multplying 10': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).select(
                       function (value, name) { return name + '.' + value; },
                       function (value, name) { return (name + value).toUpperCase(); }
                   ).run(),
            'Should return { ABC: "abc123", DEF: "def456", XYZ: "xyz789" }': function (topic) {
                assert.deepEqual(topic, { ABC123: 'abc.123', DEF456: 'def.456', XYZ789: 'xyz.789' });
            }
        },

        'When selecting an empty map': {
            topic: linq({}).select(assert.fail, assert.fail).run(),
            'Should return an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },

        'When selecting an unspecified map': {
            topic: linq().select(assert.fail, assert.fail).run(),
            'Should return an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },

        'When selecting with an invalid selector': {
            topic: function () {
                var callback = this.callback;

                linq({}).async.select('invalid', assert.fail).run(function (err) {
                    callback(null, err);
                });
            },
            'Should throws': function (topic) {
                assert(topic instanceof Error);
            }
        },

        'When selecting with an invalid key selector': {
            topic: function () {
                var callback = this.callback;

                linq({}).async.select(null, 'invalid').run(function (err) {
                    callback(null, err);
                });
            },
            'Should throws': function (topic) {
                assert(topic instanceof Error);
            }
        },

        'When an async run finished with an exception callback': {
            topic: function () {
                var callback = this.callback,
                    count = 0;

                linq({}).async.select(assert.fail).run(function (err) {
                    if (!count++) {
                        setTimeout(callback, 0);
                        throw new Error();
                    } else {
                        assert.fail();
                    }
                })
            },
            'Should ignore callback': function () {}
        }
    }).export(module);
}(
    require('assert'),
    require('../linq3')
);