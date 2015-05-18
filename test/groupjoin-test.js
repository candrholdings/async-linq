!function (assert, vows, linq, util) {
    'use strict';

    vows.describe('linq.groupJoin.array').addBatch({
        'Group join a structure': {
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
                    result: linq([magnus, terry, charlotte, donald]).groupJoin([barley, boots, whiskers, daisy], function (person) { return person; }, function (pet) { return pet.owner; }, function (person, pets) {
                        return {
                            owner: person,
                            pets: pets
                        };
                    }, function (leftOwner, rightOwner) {
                        return leftOwner.name.toLowerCase() === rightOwner.name.toLowerCase();
                    }).run()
                };
            },
            'Should return a grouped structure': function (topic) {
                assert.deepEqual(topic.result, [{
                    owner: topic.magnus,
                    pets: [topic.daisy]
                }, {
                    owner: topic.terry,
                    pets: [topic.barley, topic.boots]
                }, {
                    owner: topic.charlotte,
                    pets: [topic.whiskers]
                }, {
                    owner: topic.donald,
                    pets: []
                }]);
            }
        },
        'Invalid outer key selector': util.error(linq([]).groupJoin([], 'invalid'), 'invalid outerKeySelector'),
        'Invalid inner key selector': util.error(linq([]).groupJoin([], null, 'invalid'), 'invalid innerKeySelector'),
        'Invalid selector': util.error(linq([]).groupJoin([], null, null, 'invalid'), 'invalid selector'),
        'Invalid equality comparer': util.error(linq([]).groupJoin([], null, null, null, 'invalid'), 'invalid comparer')
    }).export(module);

    vows.describe('linq.groupJoin.map').addBatch({
        'Group join a structure': {
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
                    }).groupJoin({
                        barley: barley,
                        boots: boots,
                        whiskers: whiskers,
                        daisy: daisy
                    }, function (person, name) { return name; }, function (pet) { return pet.owner; }, function (person, pets) {
                        return {
                            owner: person,
                            pets: pets
                        };
                    }, function (left, right) {
                        return left.toLowerCase() === right.toLowerCase();
                    }).run()
                };
            },
            'Should return a grouped structure': function (topic) {
                assert.deepEqual(topic.result, {
                    magnus: {
                        owner: topic.magnus,
                        pets: {
                            daisy: topic.daisy
                        }
                    },
                    terry: {
                        owner: topic.terry,
                        pets: {
                            barley: topic.barley,
                            boots: topic.boots
                        }
                    },
                    charlotte: {
                        owner: topic.charlotte,
                        pets: {
                            whiskers: topic.whiskers
                        }
                    },
                    donald: {
                        owner: topic.donald,
                        pets: {}
                    }
                });
            }
        },
        'Invalid outer key selector': util.error(linq({}).groupJoin({}, 'invalid'), 'invalid outerKeySelector'),
        'Invalid inner key selector': util.error(linq({}).groupJoin({}, null, 'invalid'), 'invalid innerKeySelector'),
        'Invalid selector': util.error(linq({}).groupJoin({}, null, null, 'invalid'), 'invalid selector'),
        'Invalid equality comparer': util.error(linq({}).groupJoin({}, null, null, null, 'invalid'), 'invalid comparer')
    }).export(module);
}(require('assert'), require('vows'), require('../linq3'), require('../test-util'));