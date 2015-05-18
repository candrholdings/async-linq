!function (assert, vows, linq) {
    'use strict';

    vows.describe('linq.thenBy.array').addBatch({
        'Order an array by two ranks': {
            topic: linq(['A1', 'B1', 'A2', 'C1', 'B2', 'C2', 'A3', 'B3', 'C3']).orderBy(function (v) { return v[0]; }).thenBy(function (v) { return v[1]; }).run(),
            'Should return an ordered array': function (topic) {
                assert.deepEqual(topic, ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3']);
            }
        },
        'Order an array by two ranks without a selector': {
            topic: linq(['A1', 'B1', 'A2', 'C1', 'B2', 'C2', 'A3', 'B3', 'C3']).orderBy(function (v) { return v[0]; }).thenBy().run(),
            'Should return an ordered array': function (topic) {
                assert.deepEqual(topic.slice(0, 3).sort(), ['A1', 'A2', 'A3']);
                assert.deepEqual(topic.slice(3, 6).sort(), ['B1', 'B2', 'B3']);
                assert.deepEqual(topic.slice(6, 9).sort(), ['C1', 'C2', 'C3']);
            }
        },
        'Order an empty array': {
            topic: linq([]).orderBy(assert.fail).thenBy(assert.fail).run(),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        }
    }).export(module);

    vows.describe('linq.thenBy.map').addBatch({
        'Order a map by two ranks': {
            topic: linq({ 
                A1: { first: 'A', second: 1 },
                B1: { first: 'B', second: 1 },
                A2: { first: 'A', second: 2 },
                C1: { first: 'C', second: 1 },
                B2: { first: 'B', second: 2 },
                C2: { first: 'C', second: 2 },
                A3: { first: 'A', second: 3 },
                B3: { first: 'B', second: 3 },
                C3: { first: 'C', second: 3 }
            }).orderBy(function (v) {
                return v.first;
            }).thenBy(function (v) {
                return v.second;
            }).run(),
            'Should return an ordered map': function (topic) {
                assert.deepEqual(
                    topic,
                    {
                        A1: { first: 'A', second: 1 },
                        A2: { first: 'A', second: 2 },
                        A3: { first: 'A', second: 3 },
                        B1: { first: 'B', second: 1 },
                        B2: { first: 'B', second: 2 },
                        B3: { first: 'B', second: 3 },
                        C1: { first: 'C', second: 1 },
                        C2: { first: 'C', second: 2 },
                        C3: { first: 'C', second: 3 }
                    }
                );
            }
        },
        'Order a map by two ranks without a selector': {
            topic: linq({ 
                A1: 'A1',
                B1: 'B1',
                A2: 'A2',
                C1: 'C1',
                B2: 'B2',
                C2: 'C2',
                A3: 'A3',
                B3: 'B3',
                C3: 'C3'
            }).orderBy(function (v) {
                return v[0];
            }).thenBy().run(),
            'Should return an ordered map': function (topic) {
                assert.deepEqual(
                    topic,
                    {
                        A1: 'A1',
                        A2: 'A2',
                        A3: 'A3',
                        B1: 'B1',
                        B2: 'B2',
                        B3: 'B3',
                        C1: 'C1',
                        C2: 'C2',
                        C3: 'C3'
                    }
                );
            }
        },
        'Order an empty map': {
            topic: linq({}).orderBy(assert.fail).thenBy(assert.fail).run(),
            'Should return an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'));