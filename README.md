# Observable collections
This small module provides implementations of JavaScript/ECMAScript 'collection' objects which emit [an rxjs observable action stream] as they are mutated.

* Array
* Set
* Map
* WeakSet
* WeakMap

[an rxjs observable action stream]: https://rxjs-dev.firebaseapp.com/

In a reactive application, consuming logic may subscribe to these actions in the usual manner for using **rxjs**.

## Example
Here is *a minimal example* showing the usage of this module. It shows a subscription which logs any modification of an array to the console.

```js
const myArray = new ObservableArray();
const subscription = myArray.actions
    .subscribe(function(action) {
        console.log(action);
    });

// As the item is pushed, an action will be
// logged to the console
myArray.push('An item');
```

## Browser support
Browsers which are specifically targeted for support are:

* Internet Explorer 9+
* Chrome 55+
* Firefox 50+
* Safari 10+
* Safari iOS 10+
* Android Browser 4.4+ (KitKat onwards)
* All versions of Edge

However this module should be compatible with **any ECMAScript 5 browser**.

## Limitations
In order to provide the browser support (above) there are *two limitations which apply to observable arrays*.

* When using *brackets notation* to set array items by index, no observable action is emitted.
* If the array is resized via its `length` property, no observable action is emitted.

In both of these circumstances, it is impossible to intercept these operations without resorting to technologies which [would severely limit browser support](https://github.com/csf-dev/rxjs-observable-collections/issues/4).

### Workarounds to these limitations
To work around these limitations, to additional functions are available for observable arrays.

```js
// Sets an item by index
myArray.setItem(3, 'replacement item');

// Resizes the array
myArray.resize(20);
```

These functions have the same functionality as the two limitations, but also emit an observable event from the `actions` property.