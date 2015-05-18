!function (assert) {
    'use strict';

    module.exports.error = function (topic, message, extra) {
        var test = {
            topic: function () {
                var callback = this.callback;

                try {
                    topic.run();
                } catch (ex) {
                    return callback(null, ex);
                }

                callback();
            },
            'Should throws Error object': function (topic) {
                assert(topic instanceof Error);

                if (message instanceof RegExp) {
                    assert(message.test(topic.message));
                } else if (typeof message === 'function') {
                    message(topic);
                } else {
                    assert.equal(topic.message, message);
                }
            }
        };

        if (message) {
            if (message instanceof RegExp) {
                test['Should throws message of specified pattern'] = function (topic) {
                    assert(message.test(topic.message));
                };
            } else if (typeof message === 'function') {
                test['Should throws a specific message'] = function (topic) {
                    message(topic.message);
                };
            } else if (typeof message === 'string') {
                test['Should throws an exact message'] = function (topic) {
                    assert(topic.message, message);
                };
            } else {
                throw new Error('invalid message');
            }
        }

        Object.getOwnPropertyNames(extra || {}).forEach(function (name) {
            test[name] = value;
        });

        return test;
    };
}(require('assert'));