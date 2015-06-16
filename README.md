# async-linq

Asynchronous LINQ library for JavaScript, small, zero-dependency and strengthened by unit tests

[<img src="https://travis-ci.org/candrholdings/async-linq.svg?branch=master" />](https://travis-ci.org/candrholdings/async-linq) [![Join the chat at https://gitter.im/candrholdings/async-linq](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/candrholdings/async-linq?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Implementation status
---

We keep `async-linq` on par with .NET version with minimal adjustments to fit JavaScript language. And  referenced from [Microsoft 101 LINQ Samples page](https://code.msdn.microsoft.com/101-LINQ-Samples-3fb9811b).

Clauses implemented: `aggregate`, `all`, `any`, `average`, `concat`, `count`, `distinct`, `elementAt`, `equalAll`, `except`, `first`, `firstOrDefault`, `groupBy`, `groupJoin`, `intersect`, `join`, `last`, `lastOrDefault`, `max`, `min`, `ofType`, `orderBy`, `orderByDescending`, `range`, `repeat`, `reverse`, `select`, `selectMany`, `skip`, `skipWhile`, `sum`, `take`, `takeWhile`, `thenBy`, `thenByDescending`, `toArray`, `toDictionary`, `union`, `where`, and `zip`.

Beauty of `async-linq`
---

We love async, functional programming, and mixing between array + map. We want to bring LINQ to JavaScript without losing all beautiful aspects of JavaScript:

 1. Support both sync and async on every clauses.

 If you are building new clauses, you only need to implement async version. All async clauses will be automatically converted to sync version. Additionally, you can implement sync version for better performance too
 2. Both array and map are first-class citizen
 3. Maintain code clarity by chaining clauses
 4. Every clause is backed by unit tests, with over **500** unit tests passing
 5. Small in size, 6 KB after gzip
 6. JSHint-friendly

Before jumping in
---

There are some key differences between common practices of C# and JavaScript.

 1. `linq([0, 1, 2]).first(function (v) { return v % 2; })` will return the index to the first odd number, i.e. `1`, missing values will be returned as `undefined`

 This is to bring clauses on map to be on-par with array. because `linq({ abc: 123, def: 456, xyz: 789 }).first(...).run()` should returns the name of the map, instead of value
 2. Predicate signature is usually `function (value, indexOrName, callback)` (callback is only required for async)
 3. Comparison signature is usually `function (value1, indexOrName1, value2, indexOrName2, callback)`
 4. Selector signature is usually `function (value, indexOrName, callback)`
 5. Callback signature is usually `callback(err, result)`
 6. `this` keyword will always reference to the array/map or intermediates
 7. `run()` is required to execute the query

Examples
---

To list files and their file sizes

```
linq(['abc.txt', 'def.txt', 'xyz.txt'])
	.async
	.select(function (filename, index, callback) {
	    fs.stat(filename, function (err, stat) {
	        callback(err, err ? null : {
	            filename: filename,
	            size: stat.size
	        });
	    });
	})
	.run(function (err, result) {
	    console.log(result);
	});
```

Clauses chaining

```
linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])
    .where(function (v) { return v % 2 === 1; })
    .select(function (v) { return v * 100; })
    .run();
```

Will return `[100, 300, 500, 700, 900]`

Contribution
---

Please file bugs to issues. To include your bug as regression test, you are recommended to provide a minimal failing test case.
