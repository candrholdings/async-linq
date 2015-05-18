!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.sequenceEqual.array').addBatch({
        'Checks if two arrays with same values are equal': {
            topic: linq([123, 456, 789]).sequenceEqual([123, 456, 789]).run(),
            'Should return true': function (topic) {
                assert.equal(topic, true);
            }
        },
        'Checks if two arrays with same values but different sequence are equal': {
            topic: linq([123, 456, 789]).sequenceEqual([789, 456, 123]).run(),
            'Should return false': function (topic) {
                assert.equal(topic, false);
            }
        },
        'Checks if two empty arrays are the same': {
            topic: linq([]).sequenceEqual([]).run(),
            'Should return true': function (topic) {
                assert.equal(topic, true);
            }
        },
        'Checks if an array is same as an undefined array': {
            topic: linq([]).sequenceEqual().run(),
            'Should return false': function (topic) {
                assert.equal(topic, false);
            }
        },
        'Checks two different arrays': {
            topic: function () {
                var callback = this.callback,
                    numCalled = 0,
                    output = linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]).sequenceEqual([1, 2, 3, 4, 5, 999, 7, 8, 9, 0], function (leftValue, rightValue) {
                        numCalled++;

                        return leftValue === rightValue;
                    }).run();

                this.callback(null, {
                    numCalled: numCalled,
                    output: output
                });
            },
            'Should return false': function (topic) {
                assert.equal(topic.output, false);
            },
            'Should call comparer 6 times': function (topic) {
                assert.equal(topic.numCalled, 6);
            }
        },
        'Checks sequence equal with a custom comparer': {
            topic: linq([123, 234, 345, 456, 567]).sequenceEqual([1, 2, 3, 4, 5], function (left, right) { return ~~(left / 100) === right; }).run(),
            'Should return true': function (topic) {
                assert(topic);
            }
        },
        'Two arrays with different length': {
            topic: linq([1, 2, 3]).sequenceEqual([9], assert.fail).run(),
            'Should not call comparer': function () {}
        },
        'Invalid comparer': {
            topic: util.error(linq([]).sequenceEqual([], 'invalid'), 'invalid comparer')
        }
    }).export(module);

    vows.describe('linq.sequenceEqual.map').addBatch({
        'Checks if two maps with same values are equal': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).sequenceEqual({ abc: 123, def: 456, xyz: 789 }).run(),
            'Should return true': function (topic) {
                assert.equal(topic, true);
            }
        },
        'Checks if two maps with same values but different sequence are equal': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).sequenceEqual({ xyz: 789, def: 456, abc: 123 }).run(),
            'Should return false': function (topic) {
                assert.equal(topic, false);
            }
        },
        'Checks if two empty maps are the same': {
            topic: linq({}).sequenceEqual({}).run(),
            'Should return true': function (topic) {
                assert.equal(topic, true);
            }
        },
        'Checks if a map is same as an undefined map': {
            topic: linq({}).sequenceEqual().run(),
            'Should return false': function (topic) {
                assert.equal(topic, false);
            }
        },
        'Checks if an undefined map is same as an empty map': {
            topic: linq().sequenceEqual({}).run(),
            'Should return false': function (topic) {
                assert.equal(topic, false);
            }
        },
        'Checks if an undefined map is same as another undefined map': {
            topic: linq().sequenceEqual().run(),
            'Should return true': function (topic) {
                assert.equal(topic, true);
            }
        },
        'Checks two different maps': {
            topic: function () {
                var callback = this.callback,
                    numCalled = 0,
                    output = linq({ a: 1, b: 2, c: 3, d: 4, e: 5 }).sequenceEqual({ a: 1, b: 2, c: 999, d: 4, e: 5 }, function (leftValue, rightValue) {
                        numCalled++;

                        return leftValue === rightValue;
                    }).run();

                this.callback(null, {
                    numCalled: numCalled,
                    output: output
                });
            },
            'Should return false': function (topic) {
                assert.equal(topic.output, false);
            },
            'Should call comparer 3 times': function (topic) {
                assert.equal(topic.numCalled, 3);
            }
        },
        'Checks sequence equal with a custom comparer': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).sequenceEqual({ a: 1, d: 4, x: 7 }, function (leftValue, rightValue, leftName, rightName) {
                return ~~(leftValue / 100) === rightValue && leftName[0] === rightName;
            }).run(),
            'Should return true': function (topic) {
                assert(topic);
            }
        },
        'Invalid comparer': {
            topic: util.error(linq([]).sequenceEqual([], 'invalid'), 'invalid comparer')
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));