!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.single.array').addBatch({
        'Array with single target element': {
            topic: linq([1, 2, 3, 1, 2, 4, 5]).single(function (value) { return value === 3; }).run(),
            'Should return the target item': function (topic) {
                assert.equal(topic, 3);
            }
        },
        'Array with multiple target element': {
            topic: linq([1, 2, 3, 4, 3, 5, 6]).single(function (value) { return value === 3; }).run(),
            'Should return undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        },
        'Singleton array with no predicate': {
            topic: linq([1]).single().run(),
            'Should return first element': function (topic) {
                assert.equal(topic, 1);
            }
        },
        'Array with no predicate': {
            topic: linq([1, 2, 3]).single().run(),
            'Should return undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        },
        'Empty array': {
            topic: linq([]).single(assert.fail).run(),
            'Should not call predicate': function () {},
            'Should return undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        }
    }).export(module);

    vows.describe('linq.single.map').addBatch({
        'Map with single target element': {
            topic: linq({ a: 1, b: 2, c: 3, d: 4, e: 5 }).single(function (value) { return value === 3; }).run(),
            'Should return the target name': function (topic) {
                assert.equal(topic, 'c');
            }
        },
        'Map with multiple target element': {
            topic: linq({ a: 1, b: 2, c: 3, d: 4, C: 3, e: 5 }).single(function (value) { return value === 3; }).run(),
            'Should return undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        },
        'Singleton map with no predicate': {
            topic: linq({ abc: 123 }).single().run(),
            'Should return "abc"': function (topic) {
                assert.equal(topic, 'abc');
            }
        },
        'Map with no predicate': {
            topic: linq({ abc: 123, def: 456, xyz: 789 }).single().run(),
            'Should return undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        },
        'Empty map': {
            topic: linq({}).single(assert.fail).run(),
            'Should not call predicate': function () {},
            'Should return undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        },
        'Undefined map': {
            topic: linq({}).single(assert.fail).run(),
            'Should not call predicate': function () {},
            'Should return undefined': function (topic) {
                assert.equal(typeof topic, 'undefined');
            }
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));