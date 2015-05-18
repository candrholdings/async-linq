!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.groupBy.array').addBatch({
        'Group an array without passing key selector': {
            topic: linq([ 123, 456, 123, 789, 456, 789 ]).groupBy().run(),
            'Should return a map similar to dedupe': function (topic) {
                assert.deepEqual(topic, { '123': [ 123, 123 ], '456': [ 456, 456 ], '789': [ 789, 789 ] });
            }
        },
        'Group an array by odd and even numbers': {
            topic: linq([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]).groupBy(function (value) { return value % 2 ? 'odd' : 'even'; }).run(),
            'Should return a map with odd and even numbers': function (topic) {
                assert.deepEqual(topic, { odd: [ 1, 3, 5, 7, 9 ], even: [ 2, 4, 6, 8, 0 ] });
            }
        },
        'Group an array by odd and even index': {
            topic: linq([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]).groupBy(function (value, index) { return index % 2 ? 'odd' : 'even'; }).run(),
            'Should return a map with odd and even numbers': function (topic) {
                assert.deepEqual(topic, { odd: [ 2, 4, 6, 8, 0 ], even: [ 1, 3, 5, 7, 9 ] });
            }
        },
        'Group an empty array': {
            topic: linq([]).groupBy(assert.fail).run(),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Group an array': {
            topic:
                linq([123, 456, 100, 789, 400, 700])
                    .groupBy(function (value, index) {
                        return ~~(value / 10) + '';
                    }, function (value, index) {
                        return index + '.' + value;
                    }, function (values, index) {
                        return { values: values };
                    }, function (leftValue, rightValue, leftIndex, rightIndex) {
                        return ~~(+leftValue / 10) === ~~(+rightValue / 10);
                    })
                    .run(),
            'Should group': function (topic) {
                assert.deepEqual(topic, {
                    '12': { values: ['0.123', '2.100'] },
                    '45': { values: ['1.456', '4.400'] },
                    '78': { values: ['3.789', '5.700'] }
                });
            }
        },
        'Invalid key selector': util.error(linq([]).groupBy('invalid'), 'invalid keySelector'),
        'Invalid element selector': util.error(linq([]).groupBy(null, 'invalid'), 'invalid elementSelector'),
        'Invalid result selector': util.error(linq([]).groupBy(null, null, 'invalid'), 'invalid resultSelector'),
        'Invalid comparer': util.error(linq([]).groupBy(null, null, null, 'invalid'), 'invalid comparer'),
    }).export(module);

    vows.describe('linq.groupBy.map').addBatch({
        'Group a map without passing key selector': {
            topic: linq({ abc: 123, def: 456, ABC: 123, xyz: 789, DEF: 456, XYZ: 789 }).groupBy().run(),
            'Should return a map similar to dedupe its value': function (topic) {
                assert.deepEqual(topic, {
                    '123': { abc: 123, ABC: 123 },
                    '456': { def: 456, DEF: 456 },
                    '789': { xyz: 789, XYZ: 789 }
                });
            }
        },
        'Group a map with its case-insensitive name as key': {
            topic: linq({ abc: 123, def: 456, ABC: 123, xyz: 789, DEF: 456, XYZ: 789 }).groupBy(function (value, name) { return name.toLowerCase(); }).run(),
            'Should return a map keyed with lowercase name': function (topic) {
                assert.deepEqual(topic, {
                    abc: { abc: 123, ABC: 123 },
                    def: { def: 456, DEF: 456 },
                    xyz: { xyz: 789, XYZ: 789 }
                });
            }
        },
        'Group a map with oddity of its value': {
            topic: linq({ abc: 123, def: 456, ABC: 123, xyz: 789, DEF: 456, XYZ: 789 }).groupBy(function (value, name) { return value % 2 ? 'odd' : 'even'; }).run(),
            'Should return a map keyed with odd/even value': function (topic) {
                assert.deepEqual(topic, {
                    odd: { abc: 123, ABC: 123, xyz: 789, XYZ: 789 },
                    even: { def: 456, DEF: 456 }
                });
            }
        },
        'Group an empty map': {
            topic: linq({}).groupBy(assert.fail).run(),
            'Should return an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },
        'Group an unspecified map': {
            topic: linq().groupBy(assert.fail).run(),
            'Should return an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        },
        'Group a map': {
            topic:
                linq({ a: 123, b: 456, c: 100, d: 789, e: 400, f: 700 })
                    .groupBy(function (value, name) {
                        return ~~(value / 10) + '';
                    }, function (value, name) {
                        return name + '.' + value;
                    }, function (values, name) {
                        return { values: values };
                    }, function (leftValue, rightValue) {
                        return ~~(+leftValue / 10) === ~~(+rightValue / 10);
                    })
                    .run(),
            'Should group': function (topic) {
                assert.deepEqual(topic, {
                    '12': { values: { a: 'a.123', c: 'c.100' } },
                    '45': { values: { b: 'b.456', e: 'e.400' } },
                    '78': { values: { d: 'd.789', f: 'f.700' } }
                });
            }
        },
        'Invalid key selector': util.error(linq({}).groupBy('invalid'), 'invalid keySelector'),
        'Invalid element selector': util.error(linq({}).groupBy(null, 'invalid'), 'invalid elementSelector'),
        'Invalid result selector': util.error(linq({}).groupBy(null, null, 'invalid'), 'invalid resultSelector'),
        'Invalid comparer': util.error(linq({}).groupBy(null, null, null, 'invalid'), 'invalid comparer'),
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));