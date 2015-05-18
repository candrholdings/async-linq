!function (assert, vows, linq) {
    'use strict';

    vows.describe('linq.selectmany.array').addBatch({
        'Selecting a 2D array': {
            topic:
                linq([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
                    .selectMany(
                        function (array) {
                            return array.map(function (value) { return '#' + value; });
                        },
                        function (value2, index2, value1, index1) {
                            return index1 + '.' + index2 + '.' + value2;
                        }
                    )
                    .run(),

            'Should be ok': function (topic) {
                assert.deepEqual(topic, [
                    '0.0.#1',
                    '0.1.#2',
                    '0.2.#3',
                    '1.0.#4',
                    '1.1.#5',
                    '1.2.#6',
                    '2.0.#7',
                    '2.1.#8',
                    '2.2.#9'
                ]);
            }
        },

        'Selecting a 2D array without iterator and selector': {
            topic: linq([[1, 2, 3], [4, 5, 6], [7, 8, 9]]).selectMany().run(),

            'Should flatten the array': function (topic) {
                assert.deepEqual(topic, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
            }
        },

        'Selecting two different arrays': {
            topic: linq([123, 456, 789]).selectMany(function () { return ['abc', 'def', 'xyz']; }, function (v2, i2, v1, i1) { return i1 + '.' + v1 + '-' + i2 + '.' + v2 }).run(),

            'Should mix them together': function (topic) {
                assert.deepEqual(topic, [
                    '0.123-0.abc',
                    '0.123-1.def',
                    '0.123-2.xyz',
                    '1.456-0.abc',
                    '1.456-1.def',
                    '1.456-2.xyz',
                    '2.789-0.abc',
                    '2.789-1.def',
                    '2.789-2.xyz'
                ]);
            }
        },

        'Selecting with invalid collection selector': {
            topic: function () {
                var callback = this.callback;

                linq([]).async.selectMany('invalid', function () {}).run(function (err) {
                    callback(null, err);
                });
            },

            'Should throws': function (topic) {
                assert(topic instanceof Error);
            }
        },

        'Selecting with invalid result selector': {
            topic: function () {
                var callback = this.callback;

                linq([]).async.selectMany(function () {}, 'invalid').run(function (err) {
                    callback(null, err);
                });
            },

            'Should throws': function (topic) {
                assert(topic instanceof Error);
            }
        }
    }).export(module);

    vows.describe('linq.selectmany.map').addBatch({
        'Selecting a map of depth 2': {
            topic:
                linq(
                    { abc: { a: 1, b: 2, c: 3 }, def: { d: 4, e: 5, f: 6 }, xyz: { x: 7, y: 8, z: 9 }}
                ).selectMany(
                    function (value, name) {
                        switch (name) {
                        case 'abc':
                            assert.deepEqual(value, { a: 1, b: 2, c: 3 });
                            break;

                        case 'def':
                            assert.deepEqual(value, { d: 4, e: 5, f: 6 });
                            break;

                        case 'xyz':
                            assert.deepEqual(value, { x: 7, y: 8, z: 9 });
                            break;

                        default:
                            assert.fail();
                            break;
                        }

                        return value;
                    },
                    function (value2, name2, value1, name1) {
                        return name1 + '.' + JSON.stringify(value1) + '-' + name2 + '.' + value2;
                    },
                    function (value2, name2, value1, name1) {
                        return name1 + '.' + JSON.stringify(value1) + '-' + name2 + '.' + value2;
                    }
                ).run(),

            'Should be ok': function (topic) {
                assert.deepEqual(topic, {
                    'abc.{"a":1,"b":2,"c":3}-a.1': 'abc.{"a":1,"b":2,"c":3}-a.1',
                    'abc.{"a":1,"b":2,"c":3}-b.2': 'abc.{"a":1,"b":2,"c":3}-b.2',
                    'abc.{"a":1,"b":2,"c":3}-c.3': 'abc.{"a":1,"b":2,"c":3}-c.3',
                    'def.{"d":4,"e":5,"f":6}-d.4': 'def.{"d":4,"e":5,"f":6}-d.4',
                    'def.{"d":4,"e":5,"f":6}-e.5': 'def.{"d":4,"e":5,"f":6}-e.5',
                    'def.{"d":4,"e":5,"f":6}-f.6': 'def.{"d":4,"e":5,"f":6}-f.6',
                    'xyz.{"x":7,"y":8,"z":9}-x.7': 'xyz.{"x":7,"y":8,"z":9}-x.7',
                    'xyz.{"x":7,"y":8,"z":9}-y.8': 'xyz.{"x":7,"y":8,"z":9}-y.8',
                    'xyz.{"x":7,"y":8,"z":9}-z.9': 'xyz.{"x":7,"y":8,"z":9}-z.9'
                });
            }
        },

        'Selecting a map of depth 2 without an iterator': {
            topic: linq({ abc: { a: 1, b: 2, c: 3 }, def: { d: 4, e: 5, f: 6 }, xyz: { x: 7, y: 8, z: 9 }}).selectMany().run(),

            'Should flatten the map': function (topic) {
                assert.deepEqual(topic, { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, x: 7, y: 8, z: 9 });
            }
        },

        'Selecting two different maps': {
            topic:
                linq({ abc: 123, def: 456, xyz: 789 }).selectMany(
                    function () {
                        return { ABC: '!@#', DEF: '$%^', XYZ: '&*(' };
                    },
                    function (v2, n2, v1, n1) {
                        return n1 + '.' + v1 + '-' + n2 + '.' + v2;
                    },
                    function (v2, n2, v1, n1) {
                        return n1 + n2;
                    }
                ).run(),

            'Should mix them together': function (topic) {
                assert.deepEqual(topic, {
                    abcABC: 'abc.123-ABC.!@#',
                    abcDEF: 'abc.123-DEF.$%^',
                    abcXYZ: 'abc.123-XYZ.&*(',
                    defABC: 'def.456-ABC.!@#',
                    defDEF: 'def.456-DEF.$%^',
                    defXYZ: 'def.456-XYZ.&*(',
                    xyzABC: 'xyz.789-ABC.!@#',
                    xyzDEF: 'xyz.789-DEF.$%^',
                    xyzXYZ: 'xyz.789-XYZ.&*('
                });
            }
        },

        'Selecting with invalid collection selector': {
            topic: function () {
                var callback = this.callback;

                linq({}).async.selectMany('invalid', function () {}, function () {}).run(function (err) {
                    callback(null, err);
                });
            },

            'Should throws': function (topic) {
                assert(topic instanceof Error);
            }
        },

        'Selecting with invalid result selector': {
            topic: function () {
                var callback = this.callback;

                linq({}).async.selectMany(function () {}, 'invalid', function () {}).run(function (err) {
                    callback(null, err);
                });
            },

            'Should throws': function (topic) {
                assert(topic instanceof Error);
            }
        },

        'Selecting with invalid result key selector': {
            topic: function () {
                var callback = this.callback;

                linq({}).async.selectMany(function () {}, function () {}, 'invalid').run(function (err) {
                    callback(null, err);
                });
            },

            'Should throws': function (topic) {
                assert(topic instanceof Error);
            }
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'));