The **Observable Collections** module provides implementations of JavaScript/ECMAScript 'collection' objects which emit [an rxjs observable action stream] as they are mutated: Array, Set, Map, WeakSet & WeakMap.  Reactive applications which use **rxjs** may subscribe/observe these actions to synchronise logic with modifications to those collections.

Here is *an annotated minimal example* showing the usage of an [observable Array]. You may notice that it uses ECMAScript 2015 syntax.  This module is usable in any environment which [supports ECMAScript 5+]; in practice that's Internet Explorer 9+ and *all other modern browsers*.


```js
const myArray = new ObservableArray();

// Immediately, the initial (empty) state
// of the array will be logged
const subscription = myArray.actions
    .subscribe(action => console.log(action));

// As the item is pushed, a 'push' action
// will also be logged
myArray.push('An item');

// Tidy up after ourselves
subscription.unsubscribe();
```

[**Full documentation** is available] on this repository's wiki.

[an rxjs observable action stream]: https://rxjs-dev.firebaseapp.com/
[observable Array]: https://github.com/csf-dev/rxjs-observable-collections/wiki/ObservableArray
[observable arrays]: https://github.com/csf-dev/rxjs-observable-collections/wiki/ObservableArray
[supports ECMAScript 5+]: https://github.com/csf-dev/rxjs-observable-collections/wiki#browserenvironment-support
[**Full documentation** is available]: https://github.com/csf-dev/rxjs-observable-collections/wiki

## Limitations
In order to provide [the range of browser & environment support], this module has to accept *two limitations, applicable to [observable arrays]*.  Specifically, no observable actions are emitted when either:

* Using *brackets notation* to set array items by index
* The array is *resized* via its `length` property

[These limitations are covered at length], with information how they may be rectified someday.  At present the solution is deemed to be too 'costly' in terms of browser support.  For example, it would exclude *all* versions of Internet Explorer.

[the range of browser & environment support]: https://github.com/csf-dev/rxjs-observable-collections/wiki#browserenvironment-support
[These limitations are covered at length]: https://github.com/csf-dev/rxjs-observable-collections/issues/4

### Workaround
As a workaround to these limitations, two additional functions are available for observable arrays.

```js
// Sets an item by index
myArray.setItem(3, 'replacement item');

// Resizes the array
myArray.resize(20);
```

These functions have the same functionality as the two scenarios described above but also emit the observable action as expected.