# **reac-ter**: reactive setter/getter

Simple class which allows to setup accessors to any object property and then hook callback functions which are immediately called upon altering object properties through those accessors

This is done with only one class: `ReacTer`. Code in written in ES2015 (ECMAScript 6) and has no dependency

![](./principle.svg)

If visible, picture above (principle.svg) shows a `ReacTer` instance which bears keys `a` and `bAlias` with no actual values but getters and setters to other object. It also shows those setters will trigger customer functions stored in arrays under `$watchers.a` and `$watchers.bAlias`

## Sample code

```javascript
const ReacTer = require("reac-ter");
// one object with some properties
const obj = { b: 2, c: { x: 3, y: 4 } };
// a test function
function displayFct(n, o, p) {
  console.log(`prop: ${p} new: ${n}, (old: ${o})`);
}
// builds reac-ter on setter only
let rter = new ReacTer();
// attach some properties from obj
rter.addProperty(obj, "a"); // possible even if obj.a not defined
rter.addProperty(obj.c, "x");
rter.addProperty(obj.c, "y", "cy"); // addition with alias
// three calls above print:
// "prop: a new: 3, (old: undefined)
//  prop: x new: 5, (old: 3)
//  prop: cy new: 7, (old: 4)""
// add function to each property
//  note: can use keys() as $watchers is not enumerable
Object.keys(rter).forEach((key) => {
  rter.$watchers[key].push(displayFct);
});
// each of the following assignments will trigger 'fct'
rter.a = 3; // updates obj.a
rter.x = 5; // updates obj.c.x
rter.cy = 7; // updates obj.c.y
// now defines a reac-ter on both getter and setter
rter = new ReacTer(true); // true for enabling getters as $getWatchers
obj.a = 1; // does not call anything, only sets obj.a
// a test function
function displayFctFactory(text) {
  return (v) => {
    console.log(`${text} value: ${v}`);
  };
}
rter.addProperty(obj, "a");
rter.$watchers.a.push(displayFctFactory("set1"));
rter.$watchers.a.push(displayFctFactory("set2")); // attach second function
rter.$getWatchers.a.push(displayFctFactory("get"));
const a = rter.a; // prints "get value: 1"
rter.a = a + 2; // prints "set1 value: 3" and "set2 value: 3"
```

### On arrays?

Can reference array indexes as well. From the previous code sample, this also works:

```
const arr = [1, 3, 5, 7];
rter.addProperty(arr, 1);
rter.$watchers[1].push(displayFctFactory("onArray new"));
rter[1] = 6; // prints: "onArray new value: 6"
```

## class `ReacTer` reference

### Presentation

Add external accessors to any property of key **"k"** of any object **obj** by allowing to add a setter/getter in instance of this class with same key **"k"** (or possibly an _alias_). Method for such tracking **obj.k**: `addProperty(obj, "k")`

Interest of this class lays in its `$watchers` instance property which contains the very same keys **"k"**. Each of those properties `$watcher["k"]` is an array which can contain callback functions which are called upon invoking the setter for property key **"k"** of class instance

Prototype of those callback functions: `f(newValue, oldValue, key)`, *key* is the alias if any

It's up to users to populate array `$watcher["k"]` with their callback functions

### Constructor

Without parameter (or parameter = `false`): only installs `$watchers`, on setters

With parameter `true`: installs `$watchers` on setters, and `$getWatchers` on getters

### `addProperty`

Prototype `addProperty(obj, key, alias=undefined)`

Attach `obj[key]`, with possibly `alias` as property key of this instance for `obj[key]`

Caveats: calling this function again with same property key (or alias if any) will `throw` an exception. `deleteProperty` should be called before. This function also throws if `obj` is not an object

### `$watchers`

Object containing attached properties (or aliases). Each property is an array which can/should contain callback functions fired upon setting property's contents through this class instance

This special property is not enumerable

### `$getWatchers`

Object containing attached properties (or aliases). Each property is an array which can/should contain callback functions fired upon getting property's contents through this class instance

Prototype of those callback functions: `f(value, key)`, *key* is the alias if any

This special property is not enumerable

### `deleteProperty`

Prototype `deleteProperty(keyOrAlias)`

Remove property accessors from the instance. In case of alias, pass alias, otherwise the key name given when addition was done

Return a *boolean*, `true` in case of success (meaning the `keyOrAlias` was a valid property of the instance and it has been removed as well). Ensures cleaning in `$watchers` and `$getWatchers`

## Installation

`npm install --save @labzdjee/reac-ter`

## Use case

This class has been written with **Vue.js** in mind

It allows to bind `$data` values in components to selected bits of external (potentially complex and big) objects and then have a streamlined binding between the external object and `$data`

For example, let's take an object `contents` imported from a module and a component interested in `contents.x.y.z.t` only for example used as a `v-model` and why not something more complex (`:class`...)

It seems simple and convenient to bind `$data.xyzt` to `contents.x.y.z.t` this way:

- instead of importing `contents`, import a reac-ter `rContents` which is bound to all or part of `contents`. For example `rContents.addProperty(contents.x.y.z, "t", "xyzt");`

- in component `created` method: `rContents.$watchers.xyzt.push((v) => {this.xyzt=v;});` and initialize `$data.xyzt` with `rContents.xyzt`

### Demo

A sample demo can be seen here: https://labzdjee.github.io/reac-ter

In this demo, we have a external object `configuration` and a simple **Vue.js** app which is only interested in two pieces of data from this external object. A timer modifies one piece of external data to check the proper update. A two-way binding with an `input` is also done with a filter function (hand-made, not a _Vue_ filter) which controls the input conformance

Demo code is located in `index.html` and `demo-files` subfolder of source code
