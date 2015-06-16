/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, evil:false, bitwise:false, strict:true, undef:true, curly:true, devel:true, indent:4, maxerr:50, expr:true, loopfunc:true, onevar:false, multistr:true, browser:true, node:true */

!function (exports, exportFn) {
    'use strict';

    exports = function (arrayOrMap) {
        return new Context(arrayOrMap);
    };

    exports.range = function (start, count) {
        var result = new Array(Math.max(0, count));

        while (count-- > 0) {
            result[count] = start + count;
        }

        return result;
    };

    exports.repeat = function (element, count) {
        var result = new Array(Math.max(0, count));

        while (count-- > 0) {
            result[count] = element;
        }

        return result;
    };

    var defaultComparer = function (left, right, leftIndex, rightIndex, callback) {
            callback(null, left === right);
        },
        defaultMapComparer = function (leftValue, rightValue, leftName, rightName, callback) {
            callback(null, leftValue === rightValue && leftName === rightName);
        },
        defaultSelector = function (value, index, callback) {
            callback(null, value);
        },
        defaultNameSelector = function (value, name, callback) {
            callback(null, name);
        };

    // TODO: Convert all equality comparer from (leftValue, rightValue, leftIndex, rightIndex, callback) to (leftValue, rightValue, callback)
    //       Some clauses do not have index/names
    // TODO: Rename some comparer to equalityComparer

    var fn = exports.fn = {
        aggregate: {
            array: function (seed, func, resultSelector, callback) {
                var array = this || [],
                    result = seed;

                if (!func) {
                    return callback(new Error('missing func'));
                } else if (typeof func !== 'function') {
                    return callback(new Error('invalid func'));
                }

                if (!resultSelector) {
                    resultSelector = function (value, callback) { callback(null, value); };
                } else if (typeof resultSelector !== 'function') {
                    return callback(new Error('invalid resultSelector'));
                }

                asyncEach(array, function (value, index, callback) {
                    func.call(array, result, value, index, function (err, newResult) {
                        if (!err) {
                            result = newResult;
                        }

                        callback(err);
                    });
                }, function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        resultSelector.call(array, result, function (err, selectedResult) {
                            callback(err, err ? null : selectedResult);
                        });
                    }
                });
            },
            map: function (seed, func, resultSelector, callback) {
                var map = this || {},
                    result = seed;

                if (!func) {
                    return callback(new Error('missing func'));
                } else if (typeof func !== 'function') {
                    return callback(new Error('invalid func'));
                }

                if (!resultSelector) {
                    resultSelector = function (value, callback) { callback(null, value); };
                } else if (typeof resultSelector !== 'function') {
                    return callback(new Error('invalid resultSelector'));
                }

                asyncEach(map, function (value, name, callback) {
                    func.call(map, result, value, name, function (err, newResult) {
                        if (!err) {
                            result = newResult;
                        }

                        callback(err);
                    });
                }, function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        resultSelector.call(map, result, function (err, selectedResult) {
                            callback(err, err ? null : selectedResult);
                        });
                    }
                });
            }
        },
        all: {
            array: function (predicate, callback) {
                var array = this || [],
                    result = 1;

                if (!predicate) {
                    predicate = function (value, index, callback) { callback(null, value); };
                } else if (typeof predicate !== 'function') {
                    return callback(new Error('invalid predicate'));
                }

                asyncEach(array, function (value, index, callback) {
                    predicate.call(array, value, index, function (err, testResult) {
                        if (!err && !testResult) {
                            result = 0;
                        }

                        callback(err, !!result);
                    });
                }, function (err) {
                    callback(err, err ? null : !!result);
                });
            },
            map: function (predicate, callback) {
                var map = this || [],
                    result = 1;

                if (!predicate) {
                    predicate = function (value, name, callback) { callback(null, value); };
                } else if (typeof predicate !== 'function') {
                    return callback(new Error('invalid predicate'));
                }

                asyncEach(map, function (value, name, callback) {
                    predicate.call(map, value, name, function (err, testResult) {
                        if (!err && !testResult) {
                            result = 0;
                        }

                        callback(err, !!result);
                    });
                }, function (err) {
                    callback(err, err ? null : !!result);
                });
            }
        },
        any: {
            array: function (predicate, callback) {
                var array = this || [],
                    result;

                if (!predicate) {
                    return callback(null, array.length > 0);
                } else if (typeof predicate !== 'function') {
                    return callback(new Error('invalid predicate'));
                }

                asyncEach(array, function (value, index, callback) {
                    predicate.call(array, value, index, function (err, testResult) {
                        if (!err && testResult) {
                            result = 1;
                        }

                        callback(err, !result);
                    });
                }, function (err) {
                    callback(err, err ? null : !!result);
                });
            },
            map: function (predicate, callback) {
                var map = this || [],
                    result;

                if (!predicate) {
                    return callback(null, Object.getOwnPropertyNames(map).length > 0);
                } else if (typeof predicate !== 'function') {
                    return callback(new Error('invalid predicate'));
                }

                asyncEach(map, function (value, name, callback) {
                    predicate.call(map, value, name, function (err, testResult) {
                        if (!err && testResult) {
                            result = 1;
                        }

                        callback(err, !result);
                    });
                }, function (err) {
                    callback(err, err ? null : !!result);
                });
            }
        },
        average: {
            array: function (selector, callback) {
                var array = this || [],
                    average = 0,
                    count = 0;

                if (!selector) {
                    selector = defaultSelector;
                } else if (typeof selector !== 'function') {
                    return callback(new Error('invalid selector'));
                }

                if (!array.length) { return callback(null, NaN); }

                asyncEach(array, function (value, index, callback) {
                    selector.call(array, value, index, function (err, value) {
                        if (!err) {
                            average += value;
                            count++;
                        }

                        callback(err, err ? null : !isNaN(average));
                    });
                }, function (err) {
                    callback(err, err ? null : average / count);
                });

                callback(null, average / count);
            },
            map: function (selector, callback) {
                var map = this || {},
                    average = 0,
                    count = 0;

                if (!selector) {
                    selector = defaultSelector;
                } else if (typeof selector !== 'function') {
                    return callback(new Error('invalid selector'));
                }

                if (!Object.getOwnPropertyNames(map).length) { return callback(null, NaN); }

                asyncEach(map, function (value, index, callback) {
                    selector.call(map, value, index, function (err, selectedValue) {
                        if (!err) {
                            average += selectedValue;
                            count++;
                        }

                        callback(err, err ? null : !isNaN(average));
                    });
                }, function (err) {
                    callback(err, err ? null : average / count);
                });
            }
        },
        concat: {
            array: function (second, callback) {
                if (!this && !second) { return callback(); }

                var array = this || [],
                    result = array.slice();

                if (isArray(second)) {
                    var args = (second || []).slice();

                    args.splice(0, 0, result.length, 0);
                    result.splice.apply(result, args);
                } else {
                    each(second || {}, function (value, name) {
                        result[name] = value;
                    });
                }

                callback(null, result);
            },
            map: function (second, callback) {
                if (!this && !second) { return callback(); }

                var result = {};

                each(this || {}, function (value, name) {
                    result[name] = value;
                });

                each(second || {}, function (value, name) {
                    result[name] = value;
                });

                callback(null, result);
            }
        },
        contains: {
            array: function (value, comparer, callback) {
                var left = this || [],
                    result;

                if (!comparer) {
                    comparer = defaultComparer;
                } else if (typeof comparer !== 'function') {
                    return callback(new Error('invalid comparer'));
                }

                asyncEach(left, function (leftValue, leftIndex, callback) {
                    comparer.call(left, leftValue, value, leftIndex, undefined, function (err, equal) {
                        if (!err) {
                            result = equal;
                        }

                        callback(err, !equal);
                    });
                }, function (err) {
                    callback(err, err ? null : !!result);
                });
            },
            map: function (value, comparer, callback) {
                var left = this || {},
                    result;

                if (!comparer) {
                    comparer = defaultComparer;
                } else if (typeof comparer !== 'function') {
                    return callback(new Error('invalid comparer'));
                }

                asyncEach(left, function (leftValue, name, callback) {
                    comparer.call(left, leftValue, value, name, undefined, function (err, equal) {
                        if (!err) {
                            result = equal;
                        }

                        callback(err, !equal);
                    });
                }, function (err) {
                    callback(err, err ? null : !!result);
                });
            }
        },
        count: {
            array: function (predicate, callback) {
                var array = this || [],
                    count = 0;

                if (!predicate) {
                    return callback(null, array.length);
                } else if (typeof predicate !== 'function') {
                    return callback(new Error('invalid predicate'));
                }

                asyncEach(array, function (value, index, callback) {
                    predicate.call(array, value, index, function (err, testResult) {
                        if (!err && testResult) {
                            count++;
                        }

                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : count);
                });
            },
            map: function (predicate, callback) {
                var map = this || {},
                    count = 0;

                if (!predicate) {
                    return callback(null, Object.getOwnPropertyNames(map).length);
                } else if (typeof predicate !== 'function') {
                    return callback(new Error('invalid predicate'));
                }

                asyncEach(map, function (value, name, callback) {
                    predicate.call(map, value, name, function (err, testResult) {
                        if (!err && testResult) {
                            count++;
                        }

                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : count);
                });
            }
        },
        defaultIfEmpty: {
            array: function (defaultValue, callback) {
                var array = this || [];

                if (array.length) {
                    callback(null, array.slice());
                } else {
                    callback(null, [defaultValue]);
                }
            },
            map: function (defaultValue, callback) {
                var map = this || {},
                    result = {};

                if (!Object.getOwnPropertyNames(map).length) {
                    map = defaultValue;
                }

                Object.getOwnPropertyNames(map || {}).forEach(function (name) {
                    result[name] = map[name];
                });

                callback(null, result);
            }
        },
        distinct: {
            array: function (equality, callback) {
                var array = this || [],
                    result = [];

                if (!equality) {
                    equality = function (xValue, yValue, xIndex, yIndex, callback) { callback(null, xValue === yValue); };
                } else if (typeof equality !== 'function') {
                    return callback(new Error('invalid equality'));
                }

                asyncEach(array, function (xValue, xIndex, callback) {
                    var dupe;

                    asyncEach(result, function (yValue, yIndex, callback) {
                        equality.call(array, xValue, yValue, xIndex, yIndex, function (err, equal) {
                            callback(err, err ? null : !(dupe = equal));
                        });
                    }, function (err) {
                        err || dupe || result.push(xValue);
                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            },
            map: function (equality, callback) {
                var map = this || [],
                    result = {};

                if (!equality) {
                    equality = function (xValue, yValue, xName, yName, callback) { callback(null, xValue === yValue); };
                } else if (typeof equality !== 'function') {
                    return callback(new Error('invalid equality'));
                }

                asyncEach(map, function (xValue, xName, callback) {
                    var dupe;

                    asyncEach(result, function (yValue, yName, callback) {
                        equality.call(map, xValue, yValue, xName, yName, function (err, equal) {
                            callback(err, err ? null : !(dupe = equal));
                        });
                    }, function (err) {
                        if (!err && !dupe) {
                            result[xName] = xValue;
                        }

                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            }
        },
        elementAt: {
            array: function (index, callback) {
                callback(null, (this || [])[index]);
            },
            map: function (index, callback) {
                callback(null, Object.getOwnPropertyNames(this || {})[index]);
            }
        },
        empty: {
            array: function (callback) {
                callback(null, []);
            },
            map: function (callback) {
                callback(null, {});
            }
        },
        except: {
            array: function (target, comparer, callback) {
                var array = this || [],
                    result = [];

                if (!comparer) {
                    comparer = defaultComparer;
                } else if (typeof comparer !== 'function') {
                    return callback(new Error('invalid comparer'));
                }

                asyncEach(array, function (leftValue, leftIndex, callback) {
                    var excluded;

                    asyncEach(target || [], function (rightValue, rightIndex, callback) {
                        comparer(leftValue, rightValue, leftIndex, rightIndex, function (err, equal) {
                            excluded = equal;
                            callback(err, !excluded);
                        });
                    }, function (err) {
                        err || excluded || result.push(leftValue);
                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            },
            map: function (target, comparer, callback) {
                var map = this || {},
                    result = {};

                if (!comparer) {
                    comparer = defaultMapComparer;
                } else if (typeof comparer !== 'undefined') {
                    return callback(new Error('invalid comparer'));
                }

                asyncEach(map, function (leftValue, leftName, callback) {
                    var excluded;

                    asyncEach(target || {}, function (rightValue, rightName, callback) {
                        comparer(leftValue, rightValue, leftName, rightName, function (err, equal) {
                            excluded = equal;
                            callback(err, !excluded);
                        });
                    }, function (err) {
                        if (!err && !excluded) {
                            result[leftName] = leftValue;
                        }

                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            }
        },
        first: {
            array: function (predicate, callback) {
                var array = this || [],
                    result,
                    found;

                if (!predicate) {
                    predicate = function (value, index, callback) { callback(null, value); };
                } else if (typeof predicate !== 'function') {
                    return callback(new Error('invalid predicate'));
                }

                asyncEach(array, function (value, index, callback) {
                    predicate.call(array, value, index, function (err, testResult) {
                        if (!err && testResult) {
                            result = index;
                            found = 1;

                            return callback(null, false);
                        }

                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            },
            map: function (predicate, callback) {
                var map = this || [],
                    result,
                    found;

                if (!predicate) {
                    predicate = function (value, name, callback) { callback(null, value); };
                } else if (typeof predicate !== 'function') {
                    return callback(new Error('invalid predicate'));
                }

                asyncEach(map, function (value, name, callback) {
                    predicate.call(map, value, name, function (err, testResult) {
                        if (!err && testResult) {
                            result = name;
                            found = 1;

                            return callback(null, false);
                        }

                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            }
        },
        groupBy: {
            array: function (keySelector, elementSelector, resultSelector, comparer, callback) {
                var array = this || [],
                    result = {};

                if (!keySelector) {
                    keySelector = defaultSelector;
                } else if (typeof keySelector !== 'function') {
                    return callback(new Error('invalid keySelector'));
                }

                if (!elementSelector) {
                    elementSelector = defaultSelector;
                } else if (typeof elementSelector !== 'function') {
                    return callback(new Error('invalid elementSelector'));
                }

                if (!resultSelector) {
                    resultSelector = defaultSelector;
                } else if (typeof resultSelector !== 'function') {
                    return callback(new Error('invalid resultSelector'));
                }

                if (!comparer) {
                    comparer = defaultComparer;
                } else if (typeof comparer !== 'function') {
                    return callback(new Error('invalid comparer'));
                }

                asyncEach(array, function (value, index, callback) {
                    keySelector.call(array, value, index, function (err, key) {
                        if (err) { return callback(err); }

                        elementSelector.call(array, value, index, function (err, selectedValue) {
                            if (err) { return callback(err); }

                            var found;

                            // "key" will be a name in map, therefore, it must be a string
                            // We convert it to string first to let comparer do easier work
                            key += '';

                            asyncEach(result, function (group, groupKey, callback) {
                                comparer.call(array, key, groupKey, index, undefined, function (err, compareResult) {
                                    if (!err && compareResult) {
                                        group.push(selectedValue);
                                        found = 1;
                                    }

                                    callback(err, !found);
                                });
                            }, function (err) {
                                if (!err && !found) {
                                    (result[key] = []).push(selectedValue);
                                }

                                callback(err);
                            });
                        });
                    });
                }, function (err) {
                    var selectedResult = {};

                    asyncEach(result, function (group, key, callback) {
                        resultSelector.call(array, group, key, function (err, newGroup) {
                            if (!err) {
                                selectedResult[key] = newGroup;
                            }

                            callback(err);
                        });
                    }, function (err) {
                        callback(err, err ? null : selectedResult);
                    });
                });
            },
            map: function (keySelector, elementSelector, resultSelector, comparer, callback) {
                var map = this || {},
                    result = {};

                if (!keySelector) {
                    keySelector = defaultSelector;
                } else if (typeof keySelector !== 'function') {
                    return callback(new Error('invalid keySelector'));
                }

                if (!elementSelector) {
                    elementSelector = defaultSelector;
                } else if (typeof elementSelector !== 'function') {
                    return callback(new Error('invalid elementSelector'));
                }

                if (!resultSelector) {
                    resultSelector = defaultSelector;
                } else if (typeof resultSelector !== 'function') {
                    return callback(new Error('invalid resultSelector'));
                }

                if (!comparer) {
                    comparer = defaultComparer;
                } else if (typeof comparer !== 'function') {
                    return callback(new Error('invalid comparer'));
                }

                asyncEach(map, function (value, name, callback) {
                    keySelector.call(map, value, name, function (err, key) {
                        if (err) { return callback(err); }

                        elementSelector.call(map, value, name, function (err, selectedValue) {
                            if (err) { return callback(err); }

                            var found;

                            // "key" will be a name in map, therefore, it must be a string
                            // We convert it to string first to let comparer do easier work
                            key += '';

                            asyncEach(result, function (group, groupKey, callback) {
                                comparer.call(map, key, groupKey, name, undefined, function (err, compareResult) {
                                    if (!err && compareResult) {
                                        group[name] = selectedValue;
                                        found = 1;
                                    }

                                    callback(err, !found);
                                });
                            }, function (err) {
                                if (!err && !found) {
                                    (result[key] = {})[name] = selectedValue;
                                }

                                callback(err);
                            });
                        });
                    });
                }, function (err) {
                    var selectedResult = {};

                    asyncEach(result, function (group, key, callback) {
                        resultSelector.call(map, group, key, function (err, newGroup) {
                            if (!err) {
                                selectedResult[key] = newGroup;
                            }

                            callback(err);
                        });
                    }, function (err) {
                        callback(err, err ? null : selectedResult);
                    });
                });
            }
        },
        groupJoin: {
            array: function (inner, outerKeySelector, innerKeySelector, selector, comparer, callback) {
                var outer = this || [],
                    keyedOuter = new Array(outer.length),
                    keyedInner = new Array(inner.length);

                if (!outerKeySelector) {
                    outerKeySelector = defaultSelector;
                } else if (typeof outerKeySelector !== 'function') {
                    return callback(new Error('invalid outerKeySelector'));
                }

                if (!innerKeySelector) {
                    innerKeySelector = defaultSelector;
                } else if (typeof innerKeySelector !== 'function') {
                    return callback(new Error('invalid innerKeySelector'));
                }

                if (!selector) {
                    selector = defaultSelector;
                } else if (typeof selector !== 'function') {
                    return callback(new Error('invalid selector'));
                }

                if (!comparer) {
                    comparer = defaultComparer;
                } else if (typeof comparer !== 'function') {
                    return callback(new Error('invalid comparer'));
                }

                asyncEach(outer, function (value, index, callback) {
                    outerKeySelector.call(outer, value, index, function (err, outerKey) {
                        if (!err) {
                            keyedOuter[index] = {
                                key: outerKey,
                                value: value,
                                index: index
                            };
                        }

                        callback(err);
                    });
                }, function (err) {
                    if (err) { return callback(err); }

                    asyncEach(inner, function (value, index, callback) {
                        innerKeySelector.call(inner, value, index, function (err, innerKey) {
                            if (!err) {
                                keyedInner[index] = {
                                    key: innerKey,
                                    value: value,
                                    index: index
                                };
                            }

                            callback(err);
                        });
                    }, function (err) {
                        var result = [];

                        asyncEach(keyedOuter, function (outerValue, outerIndex, callback) {
                            var matchedInnerValues = [],
                                matchedInnerIndices = [];

                            asyncEach(keyedInner, function (inner, innerIndex, callback) {
                                comparer.call(outer, outerValue.key, inner.key, outerValue.index, innerIndex, function (err, equal) {
                                    if (!err && equal) {
                                        matchedInnerValues.push(inner.value);
                                        matchedInnerIndices.push(innerIndex);
                                    }

                                    callback(err);
                                });
                            }, function (err) {
                                selector.call(outer, outerValue.value, matchedInnerValues, outerIndex, matchedInnerIndices, function (err, joined) {
                                    !err && result.push(joined);
                                    callback(err);
                                });
                            });
                        }, function (err) {
                            callback(err, err ? null : result);
                        });
                    });
                });
            },
            map: function (inner, outerKeySelector, innerKeySelector, selector, comparer, callback) {
                var outer = this || {},
                    keyedOuter = {},
                    keyedInner = {};

                if (!outerKeySelector) {
                    outerKeySelector = defaultNameSelector;
                } else if (typeof outerKeySelector !== 'function') {
                    return callback(new Error('invalid outerKeySelector'));
                }

                if (!innerKeySelector) {
                    innerKeySelector = defaultNameSelector;
                } else if (typeof innerKeySelector !== 'function') {
                    return callback(new Error('invalid innerKeySelector'));
                }

                if (!selector) {
                    selector = defaultSelector;
                } else if (typeof selector !== 'function') {
                    return callback(new Error('invalid selector'));
                }

                if (!comparer) {
                    comparer = defaultComparer;
                } else if (typeof comparer !== 'function') {
                    return callback(new Error('invalid comparer'));
                }

                asyncEach(outer, function (value, name, callback) {
                    outerKeySelector.call(outer, value, name, function (err, outerKey) {
                        if (!err) {
                            keyedOuter[name] = {
                                key: outerKey,
                                value: value,
                                name: name
                            };
                        }

                        callback(err);
                    });
                }, function (err) {
                    if (err) { return callback(err); }

                    asyncEach(inner, function (value, name, callback) {
                        innerKeySelector.call(inner, value, name, function (err, innerKey) {
                            if (!err) {
                                keyedInner[name] = {
                                    key: innerKey,
                                    value: value,
                                    name: name
                                };
                            }

                            callback(err);
                        });
                    }, function (err) {
                        var result = [];

                        asyncEach(keyedOuter, function (outerValue, outerName, callback) {
                            var matchedInnerValues = {},
                                matchedInnerNames = [];

                            asyncEach(keyedInner, function (inner, innerName, callback) {
                                comparer.call(outer, outerValue.key, inner.key, outerValue.name, innerName, function (err, equal) {
                                    if (!err && equal) {
                                        matchedInnerValues[innerName] = inner.value;
                                        matchedInnerNames.push(innerName);
                                    }

                                    callback(err);
                                });
                            }, function (err) {
                                selector.call(outer, outerValue.value, matchedInnerValues, outerName, matchedInnerNames, function (err, joined) {
                                    if (!err) {
                                        result[outerName] = joined;
                                    }

                                    callback(err);
                                });
                            });
                        }, function (err) {
                            callback(err, err ? null : result);
                        });
                    });
                });
            }
        },
        intersect: {
            array: function (target, comparer, callback) {
                var array = this || [],
                    result = [];

                if (!comparer) {
                    comparer = defaultComparer;
                } else if (typeof comparer !== 'function') {
                    callback(new Error('invalid comparer'));
                }

                asyncEach(array, function (leftValue, leftIndex, callback) {
                    var found;

                    asyncEach(target || [], function (rightValue, rightIndex, callback) {
                        comparer.call(array, leftValue, rightValue, leftIndex, rightIndex, function (err, equal) {
                            callback(err, !(found = equal));
                        });
                    }, function (err) {
                        !err && found && result.push(leftValue);
                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            },
            map: function (target, comparer, callback) {
                var map = this || {},
                    mapNames = Object.getOwnPropertyNames(map),
                    result = {};

                if (!comparer) {
                    comparer = defaultMapComparer;
                } else if (typeof comparer !== 'function') {
                    callback(new Error('invalid comparer'));
                }

                asyncEach(map, function (leftValue, leftName, callback) {
                    var found;

                    asyncEach(target || {}, function (rightValue, rightName, callback) {
                        comparer.call(map, leftValue, rightValue, leftName, rightName, function (err, equal) {
                            callback(err, !(found = equal));
                        });
                    }, function (err) {
                        if (!err && found) {
                            result[leftName] = leftValue;
                        }

                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            }
        },
        join: {
            array: function (inner, outerKeySelector, innerKeySelector, selector, comparer, callback) {
                var outer = this || [],
                    keyedOuter = new Array(outer.length),
                    keyedInner = new Array(inner.length);

                if (!outerKeySelector) {
                    outerKeySelector = defaultSelector;
                } else if (typeof outerKeySelector !== 'function') {
                    return callback(new Error('invalid outerKeySelector'));
                }

                if (!innerKeySelector) {
                    innerKeySelector = defaultSelector;
                } else if (typeof innerKeySelector !== 'function') {
                    return callback(new Error('invalid innerKeySelector'));
                }

                if (!selector) {
                    selector = defaultSelector;
                } else if (typeof selector !== 'function') {
                    return callback(new Error('invalid selector'));
                }

                if (!comparer) {
                    comparer = defaultComparer;
                } else if (typeof comparer !== 'function') {
                    return callback(new Error('invalid comparer'));
                }

                asyncEach(outer, function (value, index, callback) {
                    outerKeySelector.call(outer, value, index, function (err, outerKey) {
                        if (!err) {
                            keyedOuter[index] = {
                                key: outerKey,
                                value: value,
                                index: index
                            };
                        }

                        callback(err);
                    });
                }, function (err) {
                    if (err) { return callback(err); }

                    asyncEach(inner, function (value, index, callback) {
                        innerKeySelector.call(inner, value, index, function (err, innerKey) {
                            if (!err) {
                                keyedInner[index] = {
                                    key: innerKey,
                                    value: value,
                                    index: index
                                };
                            }

                            callback(err);
                        });
                    }, function (err) {
                        var result = [];

                        asyncEach(keyedOuter, function (outerValue, outerIndex, callback) {
                            asyncEach(keyedInner, function (inner, innerIndex, callback) {
                                comparer.call(outer, outerValue.key, inner.key, outerIndex, innerIndex, function (err, equal) {
                                    if (err || !equal) {
                                        callback(err);
                                    } else {
                                        selector.call(outer, outerValue.value, inner.value, outerIndex, innerIndex, function (err, joined) {
                                            !err && result.push(joined);
                                            callback(err);
                                        });
                                    }
                                });
                            }, callback);
                        }, function (err) {
                            callback(err, err ? null : result);
                        });
                    });
                });
            },
            map: function (inner, outerKeySelector, innerKeySelector, selector, comparer, callback) {
                var outer = this || {},
                    keyedOuter = {},
                    keyedInner = {};

                if (!outerKeySelector) {
                    outerKeySelector = defaultNameSelector;
                } else if (typeof outerKeySelector !== 'function') {
                    return callback(new Error('invalid outerKeySelector'));
                }

                if (!innerKeySelector) {
                    innerKeySelector = defaultNameSelector;
                } else if (typeof innerKeySelector !== 'function') {
                    return callback(new Error('invalid innerKeySelector'));
                }

                if (!selector) {
                    selector = defaultSelector;
                } else if (typeof selector !== 'function') {
                    return callback(new Error('invalid selector'));
                }

                if (!comparer) {
                    comparer = defaultComparer;
                } else if (typeof comparer !== 'function') {
                    return callback(new Error('invalid comparer'));
                }

                asyncEach(outer, function (value, name, callback) {
                    outerKeySelector.call(outer, value, name, function (err, outerKey) {
                        if (!err) {
                            keyedOuter[name] = {
                                key: outerKey,
                                value: value,
                                name: name
                            };
                        }

                        callback(err);
                    });
                }, function (err) {
                    if (err) { return callback(err); }

                    asyncEach(inner, function (value, name, callback) {
                        innerKeySelector.call(inner, value, name, function (err, innerKey) {
                            if (!err) {
                                keyedInner[name] = {
                                    key: innerKey,
                                    value: value,
                                    name: name
                                };
                            }

                            callback(err);
                        });
                    }, function (err) {
                        var result = {};

                        asyncEach(keyedOuter, function (outerValue, outerName, callback) {
                            var outerResults = [];

                            asyncEach(keyedInner, function (inner, innerName, callback) {
                                comparer.call(outer, outerValue.key, inner.key, outerValue.name, innerName, function (err, equal) {
                                    if (err || !equal) {
                                        callback(err);
                                    } else {
                                        selector.call(outer, outerValue.value, inner.value, outerName, innerName, function (err, joined) {
                                            if (!err) {
                                                outerResults.push(joined);
                                            }

                                            callback(err);
                                        });
                                    }
                                });
                            }, function (err) {
                                if (!err && outerResults.length) {
                                    result[outerName] = outerResults;
                                }

                                callback(err);
                            });
                        }, function (err) {
                            callback(err, err ? null : result);
                        });
                    });
                });
            }
        },
        last: {
            array: function (predicate, callback) {
                var array = this || [];

                if (!predicate) {
                    predicate = function (value, index, callback) { callback(null, value); };
                } else if (typeof predicate !== 'function') {
                    return callback(new Error('invalid predicate'));
                }

                var newPredicate = function () {
                    // We need a new predicate because the "this" context should be "array" instead of "array.reverse()"
                    predicate.apply(array, arguments);
                };

                fn.first.array.call(array.reverse(), newPredicate, function (err, index) {
                    callback(err, err ? null : typeof index === 'undefined' ? undefined : (array.length - index));
                });
            },
            map: function (predicate, callback) {
                var map = this || {};

                if (!predicate) {
                    predicate = function (value, name, callback) { callback(null, value); };
                } else if (typeof predicate !== 'function') {
                    return callback(new Error('invalid predicate'));
                }

                var newPredicate = function () {
                    // We need a new predicate because the "this" context should be "map" instead of "map.reverse()"
                    predicate.apply(map, arguments);
                };

                fn.reverse.map.call(map, function (err, reversed) {
                    if (err) { return callback(err); }

                    fn.first.map.call(reversed, newPredicate, function () {
                        callback.apply(map, arguments);
                    });
                });
            }
        },
        max: {
            array: function (selector, callback) {
                var array = this || [],
                    max,
                    maxValue;

                if (!selector) {
                    selector = defaultSelector;
                } else if (typeof selector !== 'function') {
                    return callback(new Error('invalid selector'));
                }

                if (!array.length) {
                    return callback();
                }

                asyncEach(array, function (value, index, callback) {
                    selector.call(array, value, index, function (err, selectedValue) {
                        if (!err && (selectedValue > max || typeof max === 'undefined')) {
                            max = selectedValue;
                            maxValue = value;
                        }

                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : maxValue);
                });
            },
            map: function (selector, callback) {
                var map = this || {},
                    max,
                    maxName;

                if (!selector) {
                    selector = defaultSelector;
                } else if (typeof selector !== 'function') {
                    return callback(new Error('invalid selector'));
                }

                if (!Object.getOwnPropertyNames(map).length) { return callback(); }

                asyncEach(map, function (value, name, callback) {
                    selector.call(map, value, name, function (err, selectedValue) {
                        if (!err && (selectedValue > max || typeof max === 'undefined')) {
                            max = selectedValue;
                            maxName = name;
                        }

                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : maxName);
                });
            }
        },
        min: {
            array: function (selector, callback) {
                var array = this || [],
                    min,
                    minValue;

                if (!selector) {
                    selector = defaultSelector;
                } else if (typeof selector !== 'function') {
                    return callback(new Error('invalid selector'));
                }

                if (!array.length) {
                    return callback();
                }

                asyncEach(array, function (value, index, callback) {
                    selector.call(array, value, index, function (err, selectedValue) {
                        if (!err && (selectedValue < min || typeof min === 'undefined')) {
                            min = selectedValue;
                            minValue = value;
                        }

                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : minValue);
                });
            },
            map: function (selector, callback) {
                var map = this || {},
                    min,
                    minName;

                if (!selector) {
                    selector = defaultSelector;
                } else if (typeof selector !== 'function') {
                    return callback(new Error('invalid selector'));
                }

                if (!Object.getOwnPropertyNames(map).length) { return callback(); }

                asyncEach(map, function (value, name, callback) {
                    selector.call(map, value, name, function (err, selectedValue) {
                        if (!err && (selectedValue < min || typeof min === 'undefined')) {
                            min = selectedValue;
                            minName = name;
                        }

                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : minName);
                });
            }
        },
        ofType: {
            array: function (type, callback) {
                var array = this || [],
                    test;

                if (!type) { return callback(null, []); }

                test = typeof type === 'string' ? function (o) { return typeof o === type; } : function (o) { return o instanceof type; };

                callback(null, array.reduce(function (result, value) {
                    test(value) && result.push(value);

                    return result;
                }, []));
            },
            map: function (type, callback) {
                var map = this || {},
                    test,
                    result = {};

                if (!type) { return callback(null, {}); }

                test = typeof type === 'string' ? function (o) { return typeof o === type; } : function (o) { return o instanceof type; };

                callback(null, Object.getOwnPropertyNames(map).reduce(function (result, name) {
                    var value = map[name];

                    if (test(value)) {
                        result[name] = value;
                    }

                    return result;
                }, {}));
            },
            options: {
                asyncArgs: [false]
            }
        },
        orderBy: {},
        orderByDescending: {},
        thenBy: {},
        thenByDescending: {},
        // It is difficult to implement orderBy with a custom comparer, because we are using Array.sort() which requires sync operations.
        // If we need to implement custom comparer, then we need to build Array.sort() by ourselves and probably a big perf hit.
        _orderBy: {
            array: function (selectors, callback) {
                var array = this || [],
                    sorted = new Array(array.length),
                    numSelectors = selectors.length;

                asyncEach(array, function (value, index, callback) {
                    var ranks = new Array(numSelectors);

                    asyncEach(selectors, function (selector, selectorIndex, callback) {
                        selector.fn.call(array, value, index, function (err, rank) {
                            if (!err) {
                                ranks[selectorIndex] = rank;
                            }

                            callback(err);
                        });
                    }, function (err) {
                        if (!err) {
                            sorted[index] = {
                                ranks: ranks,
                                value: value,
                                index: index
                            };
                        }

                        callback(err);
                    });
                }, function (err) {
                    if (err) { return callback(err); }

                    callback(null, sorted.sort(function (x, y) {
                        var selectorIndex = 0,
                            xRank, yRank, ascending;

                        for (; selectorIndex < numSelectors; selectorIndex++) {
                            xRank = x.ranks[selectorIndex];
                            yRank = y.ranks[selectorIndex];
                            ascending = selectors[selectorIndex].ascending;

                            if (xRank > yRank) {
                                return ascending ? 1 : -1;
                            } else if (xRank < yRank) {
                                return ascending ? -1 : 1;
                            }
                        }

                        return 0;
                    }).map(function (x) {
                        return x.value;
                    }));
                });
            },
            map: function (selectors, callback) {
                var map = this || {},
                    sorted = Object.getOwnPropertyNames(map).map(function (name) {
                        return {
                            name: name,
                            value: map[name]
                        };
                    });

                selectors = selectors.map(function (selector) {
                    return {
                        fn: function (value, index, callback) {
                            selector.fn.call(map, value.value, value.name, callback);
                        },
                        ascending: selector.ascending
                    };
                });

                fn._orderBy.array.call(sorted, selectors, function (err, result) {
                    if (err) { return callback(err); }

                    var mapResult = {};

                    result.forEach(function (pair) {
                        mapResult[pair.name] = pair.value;
                    });

                    callback(null, mapResult);
                });
            }
        },
        reverse: {
            array: function (callback) {
                var array = this || [];

                callback(null, array.slice().reverse());
            },
            map: function (callback) {
                var map = this || {},
                    result = {};

                Object.getOwnPropertyNames(map).reverse().forEach(function (name) {
                    result[name] = map[name];
                });

                callback(null, result);
            }
        },
        select: {
            array: function (selector, callback) {
                var array = this;

                if (!array) { return callback(null, []); }

                if (!selector) {
                    selector = defaultSelector;
                } else if (typeof selector !== 'function') {
                    return callback(new Error('invalid selector'));
                }

                var result = new Array(array.length);

                asyncEach(array, function (value, index, callback) {
                    selector.call(array, value, index, function (err, transformed) {
                        if (!err) { result[index] = transformed; }

                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            },
            map: function (selector, keySelector, callback) {
                var map = this,
                    result = {};

                if (!map) { return callback(null, {}); }

                if (!keySelector) {
                    keySelector = function (value, name, callback) { callback(null, name); };
                } else if (typeof keySelector !== 'function') {
                    return callback(new Error('invalid keySelector'));
                }

                if (!selector) {
                    selector = defaultSelector;
                } else if (typeof selector !== 'function') {
                    return callback(new Error('invalid selector'));
                }

                asyncEach(map, function (value, name, callback) {
                    keySelector.call(map, value, name, function (err, newName) {
                        if (err) { return callback(err); }

                        selector.call(map, value, name, function (err, transformed) {
                            if (!err) { result[newName] = transformed; }

                            callback(err);
                        });
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            }
        },
        selectMany: {
            array: function (collectionSelector, resultSelector, callback) {
                var array = this,
                    result = [];

                if (!array) { return callback(null, array); }

                if (!collectionSelector) {
                    collectionSelector = defaultSelector;
                } else if (typeof collectionSelector !== 'function') {
                    return callback(new Error('invalid collectionSelector'));
                }

                if (!resultSelector) {
                    resultSelector = function (value, _1, _2, _3, callback) { callback(null, value); };
                } else if (typeof resultSelector !== 'function') {
                    return callback(new Error('invalid resultSelector'));
                }

                asyncEach(array, function (subarray, subarrayIndex, callback) {
                    collectionSelector.call(array, subarray, subarrayIndex, function (err, newSubarray) {
                        if (err) { return callback(err); }

                        asyncEach(newSubarray, function (value, valueIndex, callback) {
                            resultSelector.call(array, value, valueIndex, subarray, subarrayIndex, function (err, newValue) {
                                !err && result.push(newValue);
                                callback(err);
                            });
                        }, callback);
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            },
            map: function (collectionSelector, resultSelector, resultKeySelector, callback) {
                var map = this,
                    result = {};

                if (!map) { return callback(null, map); }

                if (!collectionSelector) {
                    collectionSelector = defaultSelector;
                } else if (typeof collectionSelector !== 'function') {
                    return callback(new Error('invalid collectionSelector'));
                }

                if (!resultKeySelector) {
                    resultKeySelector = function (value2, name2, value1, name1, callback) { callback(null, name2); };
                } else if (typeof resultKeySelector !== 'function') {
                    return callback(new Error('invalid resultKeySelector'));
                }

                if (!resultSelector) {
                    resultSelector = function (value2, name2, value1, name1, callback) { callback(null, value2); };
                } else if (typeof resultSelector !== 'function') {
                    return callback(new Error('invalid resultSelector'));
                }

                asyncEach(map, function (value1, name1, callback) {
                    collectionSelector.call(map, value1, name1, function (err, newValue1) {
                        if (err) { return callback(err); }

                        asyncEach(newValue1, function (value2, name2, callback) {
                            resultSelector.call(map, value2, name2, value1, name1, function (err, newValue2) {
                                if (err) { return callback(err); }

                                resultKeySelector.call(map, value2, name2, value1, name1, function (err, newName) {
                                    if (!err) {
                                        result[newName] = newValue2;
                                    }

                                    callback(err);
                                });
                            });
                        }, callback);
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            }
        },
        sequenceEqual: {
            array: function (right, comparer, callback) {
                if (!comparer) {
                    comparer = defaultComparer;
                } else if (typeof comparer !== 'function') {
                    return callback(new Error('invalid comparer'));
                }

                if (this === right) { return callback(null, true); }

                var left = this || [],
                    result = 1;

                if (!right || left.length !== right.length) { return callback(null, false); }

                asyncEach(left, function (leftValue, index, callback) {
                    comparer.call(left, leftValue, right[index], index, index, function (err, compareResult) {
                        if (err) {
                            callback(err);
                        } else if (compareResult) {
                            callback();
                        } else {
                            result = 0;
                            callback(null, false);
                        }
                    });
                }, function (err) {
                    callback(err, err ? null : !!result);
                });
            },
            map: function (right, comparer, callback) {
                if (!comparer) {
                    comparer = defaultMapComparer;
                } else if (typeof comparer !== 'function') {
                    return callback(new Error('invalid comparer'));
                }

                if (this === right) { return callback(null, true); }

                if (!right) { return callback(null, false); }

                var left = this || [],
                    leftNames = Object.getOwnPropertyNames(left),
                    rightNames = Object.getOwnPropertyNames(right),
                    result = 1;

                if (leftNames.length !== rightNames.length) { return callback(null, false); }

                asyncEach(leftNames, function (leftName, index, callback) {
                    var rightName = rightNames[index];

                    comparer.call(left, left[leftName], right[rightName], leftName, rightName, function (err, compareResult) {
                        if (err) {
                            callback(err);
                        } else if (compareResult) {
                            callback();
                        } else {
                            result = 0;
                            callback(null, false);
                        }
                    });
                }, function (err) {
                    callback(err, err ? null : !!result);
                });
            }
        },
        single: {
            array: function (predicate, callback) {
                var array = this || [];

                if (!array.length) { return callback(); }

                var count = 0,
                    foundValue;

                if (predicate) {
                    asyncEach(array, function (value, index, callback) {
                        predicate.call(array, value, index, function (err, predicateResult) {
                            if (err || !predicateResult) {
                                callback(err);
                            } else {
                                foundValue = ++count === 1 ? value : undefined;

                                callback(null, count === 1);
                            }
                        });
                    }, function (err) {
                        callback(err, err ? null : foundValue);
                    });
                } else {
                    callback(null, array.length === 1 ? array[0] : undefined);
                }
            },
            map: function (predicate, callback) {
                var map = this || {},
                    names = Object.getOwnPropertyNames(map);

                if (!names.length) { return callback(); }

                var count = 0,
                    foundName;

                if (predicate) {
                    asyncEach(map, function (value, name, callback) {
                        predicate.call(map, value, name, function (err, predicateResult) {
                            if (err || !predicateResult) {
                                callback(err);
                            } else {
                                foundName = ++count === 1 ? name : undefined;

                                callback(null, count === 1);
                            }
                        });
                    }, function (err) {
                        callback(err, err ? null : foundName);
                    });
                } else {
                    callback(null, names.length === 1 ? names[0] : undefined);
                }
            }
        },
        skip: {
            array: function (count, callback) {
                var array = this || [];

                if (typeof count !== 'number') {
                    callback(new Error('invalid count'));
                } else {
                    callback(null, array.slice(Math.max(0, count)));
                }
            },
            map: function (count, callback) {
                var map = this || {},
                    result = {};

                if (typeof count !== 'number') {
                    return callback(new Error('invalid count'));
                }

                Object.getOwnPropertyNames(map).slice(Math.max(0, count)).forEach(function (key) {
                    result[key] = map[key];
                });

                callback(null, result);
            }
        },
        skipWhile: {
            array: function (predicate, callback) {
                var array = this || [],
                    result = [];

                if (!predicate) {
                    predicate = function (value, index, callback) { callback(null, !value); };
                } else if (typeof predicate !== 'function') {
                    return callback(new Error('invalid predicate'));
                }

                asyncEach(array, function (value, index, callback) {
                    predicate.call(array, value, index, function (err, predicate) {
                        if (err) {
                            callback(err);
                        } else if (predicate) {
                            callback();
                        } else {
                            result = array.slice(index);
                            callback(null, false);
                        }
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            },
            map: function (predicate, callback) {
                var map = this || {},
                    names = Object.getOwnPropertyNames(map),
                    result = {};

                if (!predicate) {
                    predicate = function (value, name, callback) { callback(null, !value); };
                } else if (typeof predicate !== 'function') {
                    return callback(new Error('invalid predicate'));
                }

                asyncEach(names, function (name, index, callback) {
                    predicate.call(map, map[name], name, function (err, predicate) {
                        if (err) {
                            callback(err);
                        } else if (predicate) {
                            callback();
                        } else {
                            names.slice(index).forEach(function (name) {
                                result[name] = map[name];
                            });

                            callback(null, false);
                        }
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            }
        },
        sum: {
            array: function (selector, callback) {
                var array = this || [],
                    sum = 0;

                if (!selector) {
                    selector = defaultSelector;
                } else if (typeof selector !== 'function') {
                    return callback(new Error('invalid selector'));
                }

                asyncEach(array, function (value, index, callback) {
                    selector.call(array, value, index, function (err, selectedValue) {
                        if (!err && typeof selectedValue !== 'undefined') {
                            sum += selectedValue;
                        }

                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : sum);
                });
            },
            map: function (selector, callback) {
                var map = this || {},
                    sum = 0;

                if (!selector) {
                    selector = defaultSelector;
                } else if (typeof selector !== 'function') {
                    return callback(new Error('invalid selector'));
                }

                asyncEach(map, function (value, name, callback) {
                    selector.call(map, value, name, function (err, selectedValue) {
                        if (!err && typeof selectedValue !== 'undefined') {
                            sum += selectedValue;
                        }

                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : sum);
                });
            }
        },
        take: {
            array: function (count, callback) {
                var array = this || [];

                if (!array) {
                    callback(null, []);
                } else if (typeof count !== 'number') {
                    callback(new Error('invalid count'));
                } else {
                    callback(null, array.slice(0, Math.max(0, count)));
                }
            },
            map: function (count, callback) {
                var map = this || {},
                    result = {};

                if (typeof count !== 'number') {
                    return callback(new Error('invalid count'));
                }

                Object.getOwnPropertyNames(map).slice(0, Math.max(0, count)).forEach(function (name) {
                    result[name] = map[name];
                });

                callback(null, result);
            }
        },
        takeWhile: {
            array: function (predicate, callback) {
                var array = this || [],
                    result = [];

                if (!predicate) {
                    predicate = function (value, index, callback) { return callback(null, value); };
                } else if (typeof predicate !== 'function') {
                    return callback(new Error('invalid predicate'));
                }

                asyncEach(array, function (value, index, callback) {
                    predicate.call(array, value, index, function (err, predicate) {
                        if (err) {
                            callback(err);
                        } else if (predicate) {
                            result.push(value);
                            callback();
                        } else {
                            callback(null, false);
                        }
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            },
            map: function (predicate, callback) {
                var map = this || {},
                    result = {};

                if (!predicate) {
                    predicate = function (value, name, callback) { callback(null, value); };
                } else if (typeof predicate !== 'function') {
                    return callback(new Error('invalid predicate'));
                }

                asyncEach(map, function (value, name, callback) {
                    predicate.call(map, value, name, function (err, predicate) {
                        if (err) {
                            callback(err);
                        } else if (predicate) {
                            result[name] = value;
                            callback();
                        } else {
                            callback(null, false);
                        }
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            }
        },
        toArray: {
            array: function (selector, callback) {
                var array = this || [],
                    result = [];

                if (!selector) {
                    selector = defaultSelector;
                } else if (typeof selector !== 'function') {
                    return callback(new Error('invalid selector'));
                }

                asyncEach(array, function (value, index, callback) {
                    selector.call(array, value, index, function (err, newValue) {
                        !err && result.push(newValue);
                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            },
            map: function (selector, callback) {
                var map = this || [],
                    result = [];

                if (!selector) {
                    selector = function (value, name, callback) { callback(null, { name: name, value: value }); };
                } else if (typeof selector !== 'function') {
                    return callback(new Error('invalid selector'));
                }

                asyncEach(map, function (value, name, callback) {
                    selector.call(map, value, name, function (err, newValue) {
                        !err && result.push(newValue);
                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            }
        },
        toDictionary: {
            array: function (keySelector, callback) {
                var array = this || [],
                    result = {};

                if (!keySelector) {
                    keySelector = defaultNameSelector;
                } else if (typeof keySelector !== 'function') {
                    return callback(new Error('invalid keySelector'));
                }

                asyncEach(array, function (value, index, callback) {
                    keySelector.call(array, value, index, function (err, name) {
                        if (!err && typeof name !== 'undefined' && name !== null && name !== false) {
                            result[name] = value;
                        }

                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            },
            map: function (keySelector, callback) {
                var map = this || {},
                    result = {};

                if (!keySelector) {
                    keySelector = defaultNameSelector;
                } else if (typeof keySelector !== 'function') {
                    return callback(new Error('invalid keySelector'));
                }

                asyncEach(map, function (value, name, callback) {
                    keySelector.call(map, value, name, function (err, newName) {
                        if (!err && typeof newName !== 'undefined' && newName !== null && newName !== false) {
                            var item = {};

                            item[name] = value;
                            result[newName] = item;
                        }

                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            }
        },
        // TODO: toLookup: {},
        union: {
            array: function (right, comparer, callback) {
                var left = this || [],
                    result = left.slice();

                if (!comparer) {
                    comparer = defaultComparer;
                } else if (typeof comparer !== 'function') {
                    return callback(new Error('invalid comparer'));
                }

                var rightIsArray = isArray(right);

                asyncEach(right || [], function (rightValue, rightIndex, callback) {
                    var duped;

                    asyncEach(left, function (leftValue, leftIndex, callback) {
                        comparer.call(left, leftValue, rightValue, leftIndex, rightIndex, function (err, compareResult) {
                            if (!err && compareResult) {
                                duped = 1;
                            }

                            callback(err, !duped);
                        });
                    }, function (err) {
                        if (!err && !duped) {
                            if (rightIsArray) {
                                result.push(rightValue);
                            } else {
                                result[rightIndex] = rightValue;
                            }
                        }

                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : err);
                });

                callback(null, result);
            },
            map: function (right, comparer, callback) {
                var left = this || {},
                    result = {};

                if (!comparer) {
                    comparer = defaultMapComparer;
                } else if (typeof comparer !== 'function') {
                    return callback(new Error('invalid comparer'));
                }

                Object.getOwnPropertyNames(left).forEach(function (name) {
                    result[name] = left[name];
                });

                asyncEach(right || {}, function (rightValue, rightName, callback) {
                    var duped;

                    asyncEach(left, function (leftValue, leftName, callback) {
                        comparer.call(left, leftValue, rightValue, leftName, rightName, function (err, compareResult) {
                            if (!err && compareResult) {
                                duped = 1;
                            }

                            callback(err, !duped);
                        });
                    }, function (err) {
                        if (!err && !duped) {
                            result[rightName] = rightValue;
                        }

                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            }
        },
        where: {
            array: function (predicate, callback) {
                var array = this,
                    result = [];

                if (!array) { return callback(null, []); }

                if (!predicate) {
                    predicate = function (value, index, callback) { callback(null, 1); };
                } else if (typeof predicate !== 'function') {
                    return callback(new Error('invalid predicate'));
                }

                asyncEach(array, function (value, index, callback) {
                    predicate.call(array, value, index, function (err, intermediate) {
                        !err && intermediate && result.push(value);

                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            },
            map: function (predicate, callback) {
                var map = this,
                    result = {};

                if (!map) { return callback(null, map); }

                if (!predicate) {
                    predicate = function (value, name, callback) { callback(null, 1); };
                } else if (typeof predicate !== 'function') {
                    return callback(new Error('invalid predicate'));
                }

                asyncEach(map, function (value, name, callback) {
                    predicate.call(map, value, name, function (err, intermediate) {
                        if (!err && intermediate) {
                            result[name] = value;
                        }

                        callback(err);
                    });
                }, function (err) {
                    callback(err, err ? null : result);
                });
            }
        },
        zip: {
            array: function (second, resultSelector, callback) {
                var first = this || [],
                    length = first.length,
                    result;

                if (!resultSelector) {
                    return callback(new Error('missing resultSelector'));
                } else if (typeof resultSelector !== 'function') {
                    return callback(new Error('invalid resultSelector'));
                }

                if (isArray(second)) {
                    length = Math.min(second.length, length);
                    result = new Array(length);

                    asyncEach(first.slice(0, length), function (firstValue, index, callback) {
                        resultSelector(firstValue, second[index], index, index, function (err, selectResult) {
                            if (!err) { result[index] = selectResult; }

                            callback(err);
                        });
                    }, function (err) {
                        callback(err, err ? null : result);
                    });
                } else if (second) {
                    var names = Object.getOwnPropertyNames(second);

                    length = Math.min(names.length, length);
                    result = new Array(length);

                    asyncEach(first.slice(0, length), function (firstValue, index, callback) {
                        var name = names[index];

                        resultSelector(firstValue, second[name], index, name, function (err, selectResult) {
                            if (!err) { result[index] = selectResult; }

                            callback(err);
                        });
                    }, function (err) {
                        callback(err, err ? null : result);
                    });
                } else {
                    callback(null, []);
                }
            },
            map: function (second, resultSelector, callback) {
                var first = this || {},
                    firstNames = Object.getOwnPropertyNames(first),
                    length = firstNames.length,
                    result;

                if (!resultSelector) {
                    return callback(new Error('missing resultSelector'));
                } else if (typeof resultSelector !== 'function') {
                    return callback(new Error('invalid resultSelector'));
                }

                if (isArray(second)) {
                    result = new Array((length = Math.min(second.length, length)));

                    asyncEach(firstNames.slice(0, length), function (firstName, index, callback) {
                        resultSelector(first[firstName], second[index], firstName, index, function (err, selectResult) {
                            if (!err) { result[index] = selectResult; }

                            callback(err);
                        });
                    }, function (err) {
                        callback(err, err ? null : result);
                    });
                } else if (second) {
                    var secondNames = Object.getOwnPropertyNames(second);

                    result = new Array((length = Math.min(secondNames.length, length)));

                    asyncEach(firstNames.slice(0, length), function (firstName, index, callback) {
                        var secondName = secondNames[index];

                        resultSelector(first[firstName], second[secondName], firstName, secondName, function (err, selectResult) {
                            if (!err) { result[index] = selectResult; }

                            callback(err);
                        });
                    }, function (err) {
                        callback(err, err ? null : result);
                    });
                } else {
                    callback(null, []);
                }
            }
        }
    };

    function Context(input) {
        var that = this,
            stack = [];

        Object.getOwnPropertyNames(fn).forEach(function (name) {
            that[name] = function () {
                var lastStack = stack[stack.length - 1],
                    lastName = lastStack && lastStack.name;

                if (name === 'orderBy' || name === 'orderByDescending') {
                    stack.push({
                        name: '_orderBy',
                        handler: fn._orderBy,
                        args: [[{ ascending: name === 'orderBy', fn: asAsync(arguments[0] || function (value, name) { return value; }) }]]
                    });
                } else if (name === 'thenBy' || name === 'thenByDescending') {
                    lastName === '_orderBy' && lastStack.args[0].push({ ascending: name === 'thenBy', fn: asAsync(arguments[0] || function (value, name) { return value; }) });
                } else {
                    stack.push({
                        name: name,
                        handler: fn[name],
                        args: makeArray(arguments)
                    });
                }

                return that;
            };
        });

        that.run = function () {
            var intermediate = input,
                err,
                invoked;

            asyncEach(stack, function (entry, index, callback) {
                var err,
                    invoked,
                    args = entry.args,
                    handler = entry.handler,
                    options = handler.options || {},
                    asyncArgs = options.asyncArgs || [],
                    syncHandler = isArray(intermediate) ? handler.arraySync : handler.mapSync;

                handler = (isArray(intermediate) ? handler.array : handler.map) || handler;

                if (syncHandler) {
                    try {
                        intermediate = syncHandler.apply(intermediate, args);
                    } catch (ex) {
                        return callback(ex);
                    }

                    callback();
                } else {
                    args = args.reduce(function (newArgs, arg, index) {
                        newArgs.push(typeof arg === 'function' && asyncArgs[index] !== false ? asAsync(arg) : arg);

                        return newArgs;
                    }, []);

                    args[handler.length - 1] = function (e, r) {
                        if (e) {
                            err = e;
                        } else {
                            intermediate = r;
                        }

                        invoked = 1;
                    };

                    try {
                        handler.apply(intermediate, args);
                    } catch (ex) {
                        return callback(ex);
                    }

                    if (!invoked) {
                        callback(new Error('Either implement "' + entry.name + '" synchronously as "arraySync" and "mapSync", or "array" and "map" must callback synchronously'));
                    } else {
                        callback(err);
                    }
                }
            }, function (e) {
                err = e;
                invoked = 1;
            });

            if (!invoked) {
                throw new Error('One or more clauses did not finish synchronously');
            } else if (err) {
                throw err;
            } else {
                return intermediate;
            }
        };

        that.async = new AsyncContext(input);
    }

    function AsyncContext(input) {
        var that = this,
            array = isArray(input),
            stack = [];

        Object.getOwnPropertyNames(fn).forEach(function (name) {
            that[name] = function () {
                var lastStack = stack[stack.length - 1],
                    lastName = lastStack && lastStack.name;

                if (name === 'orderBy' || name === 'orderByDescending') {
                    stack.push({
                        name: '_orderBy',
                        handler: fn._orderBy,
                        args: [[{ ascending: name === 'orderBy', fn: arguments[0] || function (value, name) { return value; } }]]
                    });
                } else if (name === 'thenBy' || name === 'thenByDescending') {
                    lastName === '_orderBy' && lastStack.args[0].push({ ascending: name === 'thenBy', fn: arguments[0] || function (value, name) { return value; } });
                } else {
                    stack.push({
                        name: name,
                        handler: fn[name],
                        args: makeArray(arguments)
                    });
                }

                return that;
            };
        });

        that.run = function (callback) {
            return that._run(input, function () {
                // If callback throw an exception, should silently ignore it and not calling it again
                try {
                    callback.apply(this, arguments);
                } catch (ex) {}
            });
        };

        that._run = function (intermediate, callback) {
            if (!stack.length) {
                return callback && callback.call(input, null, intermediate);
            }

            var entry = stack.shift(),
                handler = entry.handler;

            handler = (isArray(intermediate) ? handler.array : handler.map) || handler;

            entry.args[handler.length - 1] = function (err, result) {
                if (callback) {
                    if (err) {
                        callback && callback.call(input, err);
                        callback = 0;
                    } else {
                        that._run(result, callback);
                    }
                }
            };

            try {
                handler.apply(intermediate, entry.args);
            } catch (ex) {
                callback && callback.call(input, ex);
                callback = 0;
            }
        };

        that.async = that;
    }

    function makeArray(array) {
        return [].slice.call(array);
    }

    function isArray(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    }

    function asyncEach(arrayOrMap, iterator, callback) {
        var array = isArray(arrayOrMap);

        _asyncEach(
            array ? arrayOrMap : Object.getOwnPropertyNames(arrayOrMap),
            array ? iterator : function (name, index, callback) {
                return iterator(arrayOrMap[name], name, callback);
            },
            callback,
            0
        );
    }

    function _asyncEach(array, iterator, callback, index) {
        if (index >= array.length) { return callback(); }

        iterator.call(array, array[index], index, function (err, cont) {
            err ? callback(err) : cont === false ? callback() : _asyncEach(array, iterator, callback, index + 1);
        });
    }

    function each(arrayOrMap, iterator, callback) {
        var index = 0,
            length;

        if (isArray(arrayOrMap)) {
            for (length = arrayOrMap.length; index < length; index++) {
                if (iterator.call(arrayOrMap, arrayOrMap[index], index) === false) {
                    break;
                }
            }
        } else {
            var names = Object.getOwnPropertyNames(arrayOrMap),
                name;

            for (length = names.length; index < length; index++) {
                name = names[index];

                if (iterator.call(arrayOrMap, arrayOrMap[name], name) === false) {
                    break;
                }
            }
        }
    }

    function asAsync(fn) {
        return function () {
            var args = makeArray(arguments),
                callback = args.pop(),
                result;

            try {
                result = fn.apply(this, args);
            } catch (ex) {
                return callback(ex);
            }

            return callback(null, result);
        };
    }

    exports.asyncEach = asyncEach;

    exportFn(exports);
}(
    {},
    typeof window !== 'undefined' ? function (e) {  'use strict'; window.linq = e; } :
    typeof module !== 'undefined' ? function (e) {  'use strict'; module.exports = e; } :
    function () {}
);