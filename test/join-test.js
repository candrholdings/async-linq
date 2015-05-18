!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.join.array').addBatch({
        'Join a structure': {
            topic: function () {
                var magnus = { name: 'Hedlund, Magnus' },
                    terry = { name: 'Adams, Terry' },
                    charlotte = { name: 'Weiss, Charlotte' },
                    donald = { name: 'Duck, Donald' },
                    barley = { name: 'Barley', owner: terry },
                    boots = { name: 'Boots', owner: { name: 'adams, terry' } },
                    whiskers = { name: 'Whiskers', owner: charlotte },
                    daisy = { name: 'Daisy', owner: magnus };

                return {
                    magnus: magnus,
                    terry: terry,
                    charlotte: charlotte,
                    donald: donald,
                    barley: barley,
                    boots: boots,
                    whiskers: whiskers,
                    daisy: daisy,
                    result: linq([magnus, terry, charlotte, donald]).join([barley, boots, whiskers, daisy], function (person) { return person; }, function (pet) { return pet.owner; }, function (person, pet) {
                        return {
                            owner: person,
                            pet: pet
                        };
                    }, function (left, right) {
                        return left.name.toLowerCase() === right.name.toLowerCase();
                    }).run()
                };
            },
            'Should return a grouped structure': function (topic) {
                assert.deepEqual(topic.result, [{
                    owner: topic.magnus,
                    pet: topic.daisy
                }, {
                    owner: topic.terry,
                    pet: topic.barley
                }, {
                    owner: topic.terry,
                    pet: topic.boots
                }, {
                    owner: topic.charlotte,
                    pet: topic.whiskers
                }]);
            }
        },
        'Invalid outer key selector': util.error(linq([]).join([], 'invalid'), 'invalid outerKeySelector'),
        'Invalid inner key selector': util.error(linq([]).join([], null, 'invalid'), 'invalid innerKeySelector'),
        'Invalid selector': util.error(linq([]).join([], null, null, 'invalid'), 'invalid selector'),
        'Invalid equality comparer': util.error(linq([]).join([], null, null, null, 'invalid'), 'invalid comparer')
    }).export(module);

    vows.describe('linq.join.map').addBatch({
        'Join a structure': {
            topic: function () {
                var magnus = { name: 'Hedlund, Magnus' },
                    terry = { name: 'Adams, Terry' },
                    charlotte = { name: 'Weiss, Charlotte' },
                    donald = { name: 'Duck, Donald' },
                    barley = { name: 'Barley', owner: 'terry' },
                    boots = { name: 'Boots', owner: 'TERRY' },
                    whiskers = { name: 'Whiskers', owner: 'charlotte' },
                    daisy = { name: 'Daisy', owner: 'magnus' };

                return {
                    magnus: magnus,
                    terry: terry,
                    charlotte: charlotte,
                    donald: donald,
                    barley: barley,
                    boots: boots,
                    whiskers: whiskers,
                    daisy: daisy,
                    result: linq({
                        magnus: magnus,
                        terry: terry,
                        charlotte: charlotte,
                        donald: donald
                    }).join({
                        barley: barley,
                        boots: boots,
                        whiskers: whiskers,
                        daisy: daisy
                    }, function (person, name) { return name; }, function (pet) { return pet.owner; }, function (person, pet) {
                        return {
                            owner: person,
                            pet: pet
                        };
                    }, function (left, right) {
                        return left.toLowerCase() === right.toLowerCase();
                    }).run()
                };
            },
            'Should return a grouped structure': function (topic) {
                assert.deepEqual(topic.result, {
                    magnus: [{
                        owner: topic.magnus,
                        pet: topic.daisy
                    }],
                    terry: [{
                        owner: topic.terry,
                        pet: topic.barley
                    }, {
                        owner: topic.terry,
                        pet: topic.boots
                    }],
                    charlotte: [{
                        owner: topic.charlotte,
                        pet: topic.whiskers
                    }]
                });
            }
        },
        'Invalid outer key selector': util.error(linq({}).join({}, 'invalid'), 'invalid outerKeySelector'),
        'Invalid inner key selector': util.error(linq({}).join({}, null, 'invalid'), 'invalid innerKeySelector'),
        'Invalid selector': util.error(linq({}).join({}, null, null, 'invalid'), 'invalid selector'),
        'Invalid equality comparer': util.error(linq({}).join({}, null, null, null, 'invalid'), 'invalid comparer')
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));