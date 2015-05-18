!function (assert, vows, linq) {
    'use strict';

    vows.describe('linq.thenByDescending.array').addBatch({
        'Order an array by two ranks': {
            topic: linq(['A1', 'B1', 'A2', 'C1', 'B2', 'C2', 'A3', 'B3', 'C3']).orderBy(function (v) { return v[0]; }).thenByDescending(function (v) { return v[1]; }).run(),
            'Should return an ordered array': function (topic) {
                assert.deepEqual(topic, ['A3', 'A2', 'A1', 'B3', 'B2', 'B1', 'C3', 'C2', 'C1']);
            }
        },
        'Order an array by two ranks without a selector': {
            topic: linq(['A1', 'B1', 'A2', 'C1', 'B2', 'C2', 'A3', 'B3', 'C3']).orderBy(function (v) { return v[0]; }).thenByDescending().run(),
            'Should return an ordered array': function (topic) {
                assert.deepEqual(topic.slice(0, 3).sort(), ['A1', 'A2', 'A3']);
                assert.deepEqual(topic.slice(3, 6).sort(), ['B1', 'B2', 'B3']);
                assert.deepEqual(topic.slice(6, 9).sort(), ['C1', 'C2', 'C3']);
            }
        },
        'Order an empty array': {
            topic: linq([]).orderBy(assert.fail).thenByDescending(assert.fail).run(),
            'Should return an empty array': function (topic) {
                assert.deepEqual(topic, []);
            }
        }
    }).export(module);

    vows.describe('linq.thenByDescending.map').addBatch({
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
            }).thenByDescending(function (v) {
                return v.second;
            }).run(),
            'Should return an ordered map': function (topic) {
                assert.deepEqual(
                    topic,
                    {
                        A3: { first: 'A', second: 3 },
                        A2: { first: 'A', second: 2 },
                        A1: { first: 'A', second: 1 },
                        B3: { first: 'B', second: 3 },
                        B2: { first: 'B', second: 2 },
                        B1: { first: 'B', second: 1 },
                        C3: { first: 'C', second: 3 },
                        C2: { first: 'C', second: 2 },
                        C1: { first: 'C', second: 1 }
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
            }).thenByDescending().run(),
            'Should return an ordered map': function (topic) {
                assert.deepEqual(
                    topic,
                    {
                        A3: 'A3',
                        A2: 'A2',
                        A1: 'A1',
                        B3: 'B3',
                        B2: 'B2',
                        B1: 'B1',
                        C3: 'C3',
                        C2: 'C2',
                        C1: 'C1'
                    }
                );
            }
        },
        'Order an empty map': {
            topic: linq({}).orderBy(assert.fail).thenByDescending(assert.fail).run(),
            'Should return an empty map': function (topic) {
                assert.deepEqual(topic, {});
            }
        }
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'));