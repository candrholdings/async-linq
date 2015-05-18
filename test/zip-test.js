!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.zip.array').addBatch({
        'Zipping two arrays of same length together': {
            topic: linq([1, 3, 5]).zip([2, 4, 6], function (x, y) { return x * y; }).run(),
            'Should return a new array of same size': function (topic) {
                assert.deepEqual(topic, [2, 12, 30]);
            }
        },
        'Zipping two arrays with more items on left': {
            topic: linq([1, 3, 5, 7]).zip([2, 4, 6], function (x, y) { return x * y; }).run(),
            'Should return a new array zipping up to the lesser (right)': function (topic) {
                assert.deepEqual(topic, [2, 12, 30]);
            }
        },
        'Zipping two arrays with more items on right': {
            topic: linq([1, 3, 5]).zip([2, 4, 6, 8], function (x, y) { return x * y; }).run(),
            'Should return a new array zipping up to the lesser (left)': function (topic) {
                assert.deepEqual(topic, [2, 12, 30]);
            }
        },
        'Zipping an array with an empty array': {
            topic: linq([1, 3, 5]).zip([], function (x, y) { return x * y; }).run(),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Zipping an array with an undefined array': {
            topic: linq([1, 3, 5]).zip(undefined, function (x, y) { return x * y; }).run(),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Zipping an array with a map': {
            topic: linq([1, 3, 5]).zip({ abc: 123, def: 456, xyz: 789 }, function (x, y) { return x * y; }).run(),
            'Should return a new array zipping up both': function (topic) {
                assert.deepEqual(topic, [123, 1368, 3945]);
            }
        },
        'Zipping an empty array with an array': {
            topic: linq([]).zip([2, 4, 6], function (x, y) { return x * y; }).run(),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Missing result selector': util.error(linq([]).zip([]), 'missing resultSelector'),
        'Invalid result selector': util.error(linq([]).zip([], 'invalid'), 'invalid resultSelector')
    }).export(module);

    vows.describe('linq.zip.map').addBatch({
        'Zipping two maps': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).zip({ ABC: '!@#', DEF: '$%^', XYZ: '&*(' }, function (vx, vy, nx, ny) { return vx + vy + nx + ny; }).run(),
            'Should return an array': function (topic) {
                assert.deepEqual(topic, ['123!@#abcABC', '456$%^defDEF', '789&*(xyzXYZ']);
            }
        },
        'Zipping two maps with lesser on left': {
            topic: linq({ abc: 123, def: 456 }).zip({ ABC: '!@#', DEF: '$%^', XYZ: '&*(' }, function (vx, vy, nx, ny) { return vx + vy + nx + ny; }).run(),
            'Should return an array with lesser': function (topic) {
                assert.deepEqual(topic, ['123!@#abcABC', '456$%^defDEF']);
            }
        },
        'Zipping two maps with lesser on right': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).zip({ ABC: '!@#', DEF: '$%^' }, function (vx, vy, nx, ny) { return vx + vy + nx + ny; }).run(),
            'Should return an array': function (topic) {
                assert.deepEqual(topic, ['123!@#abcABC', '456$%^defDEF']);
            }
        },
        'Zipping a map with an empty map': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).zip({}, function (vx, vy, nx, ny) { return vx + vy + nx + ny; }).run(),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Zipping an empty map with a map': {
            topic: linq({}).zip({ ABC: '!@#', DEF: '$%^', XYZ: '&*(' }, function (vx, vy, nx, ny) { return vx + vy + nx + ny; }).run(),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Zipping a map with an undefined map': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).zip(undefined, function (vx, vy, nx, ny) { return vx + vy + nx + ny; }).run(),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Zipping an unspecified map with a map': {
            topic: linq().zip({ ABC: '!@#', DEF: '$%^', XYZ: '&*(' }, function (vx, vy, nx, ny) { return vx + vy + nx + ny; }).run(),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        },
        'Zipping a map with an array': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).zip([1, 3, 5], function (x, y) { return x * y; }).run(),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, [123, 1368, 3945]);
            }
        },
        'Missing result selector': util.error(linq({}).zip({}), 'missing resultSelector'),
        'Invalid result selector': util.error(linq({}).zip({}, 'invalid'), 'invalid resultSelector')
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));