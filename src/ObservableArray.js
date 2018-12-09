//@flow
import * as a from './ArrayAction';
import { BehaviorSubject } from 'rxjs';

/* Caveats of this implementation
 * ------------------------------
 * 
 * Updating values in the array by using standard array notation WILL NOT
 * result in an observable action being emitted.  Instead you must use
 * .setValue(index, newValue) if you wish the action to be emitted.
 *
 * ```
 * const arr = new ObservableArray([1, 2]);
 * arr[1] = 3;          // NO ACTION EMITTED
 * arr.setValue(1, 3);  // Action is emitted
 * ```
 *
 * Likewise, resizing the array by setting the .length property WILL NOT
 * result in an observable action being emitted.  Instead you must use
 * .resize(newLength) if you wish the action to be emitted.
 *
 * ```
 * const arr = new ObservableArray([1, 2]);
 * arr.length = 3;      // NO ACTION EMITTED
 * arr.resize(3);       // Action is emitted
 * ```
 * 
 * Both of these caveats are limitationgs of ECMAScript and its handling
 * of the Array class.  This limitation can only be worked-around by
 * using a Proxy (introduced in ECMAScript 2015) but - since proxies
 * cannot be polyfilled - this would rule out all non-ES2015 browsers.
 */

export class ObservableArray<T : mixed> extends Array<T> {
    #subject : rxjs$Subject<a.ArrayAction<T>>;

    get actions() : rxjs$Observable<a.ArrayAction<T>> { return this.#subject; }

    copyWithin(target : number, start : number = 0 , end? : number) : Array<T> {
        const result = super.copyWithin(target, start, end);
        const action = new a.ArrayCopyWithinAction(this, target, start, end);
        this.#subject.next(action);
        return result;
    }
    fill(value : T, start? : number, end? : number) : Array<T> {
        const result = super.fill(value, start, end);
        const action = new a.ArrayFillAction(this, value, start, end);
        this.#subject.next(action);
        return result;
    }
    pop() : T {
        const result = super.pop();
        const action = new a.ArrayPopAction(this);
        this.#subject.next(action);
        return result;
    }
    push(...elements : Array<T>) : number {
        const result = super.push(...elements);
        const action = new a.ArrayPushAction(this, elements);
        this.#subject.next(action);
        return result;
    }
    reverse() : Array<T> {
        const result = super.reverse();
        const action = new a.ArrayReverseAction(this);
        this.#subject.next(action);
        return result;
    }
    shift() : T {
        const result = super.shift();
        const action = new a.ArrayShiftAction(this);
        this.#subject.next(action);
        return result;
    }
    sort(compareFunction? : (a : T, b : T) => number) : Array<T> {
        const result = super.sort(compareFunction);
        const action = new a.ArraySortAction(this, compareFunction);
        this.#subject.next(action);
        return result;
    }
    splice(start : number, deleteCount? : number, ...items : Array<T>) : Array<T> {
        const result = super.splice(start, deleteCount, ...items);
        const action = new a.ArraySpliceAction(this, start, deleteCount, items);
        this.#subject.next(action);
        return result;
    }
    unshift(...elements : Array<T>) : number {
        const result = super.unshift(...elements);
        const action = new a.ArrayUnshiftAction(this, elements);
        this.#subject.next(action);
        return result;
    }
    replaceContents(newContents : Array<T>) : Array<T> {
        const previousValues = Array.from(this);
        super.length = 0;
        super.push(...newContents);
        const action = new a.ArrayReplaceContentsAction(this, previousValues);
        this.#subject.next(action);
        return previousValues;
    }
    setItem(index : number, value : T) : void {
        const start = index, end = index + 1;
        if(this.length <= start)
            super.length = end;
        super.fill(value, start, end);
        const action = new a.ArraySetItemAction(this, index, value);
        this.#subject.next(action);
    }
    resize(newLength : number) : void {
        super.length = newLength;
        const action = new a.ArrayResizeAction(this, newLength);
        this.#subject.next(action);
    }

    constructor(source? : Array<T>) {
        /* This is at odds with the standard Array constructor, in that it does NOT
         * accept 'rest' parameters in the way that a normal array would.  Compare
         * the following two examples, which create a three-element array.
         *
         *     new Array(1, 2, 3);
         *     new ObservableArray([1, 2, 3]);
         *
         * The observable version MUST have its initial state passed as an array.
         *
         * This causes an oddity when using the 'splice' function, because that
         * internally calls this constructor again, with a number indicating the
         * array's desired length (just like the normal array constructor).
         *
         * If you wish to create an observable array from rest parameters indicating
         * its initial contents, then use the static ObservableArray.fromValues
         * function.
         */ 
        if(source && Array.isArray(source)) {
            // Array initialisation with initial state
            super(...source);
        }
        else if(typeof source === 'number') {
            // Array initialisation with a predetermined length
            // FlowJS disagrees that this should be allowed, but it happens all the same
            // $FlowFixMe
            super(source);
        }
        else {
            super();
        }

        const initialAction = new a.ArrayInitialStateAction<T>(this);
        this.#subject = new BehaviorSubject(initialAction);
    }

    static fromValues<T : mixed>(...source : Array<T>) : ObservableArray<T> {
        return new ObservableArray(source);
    }
}