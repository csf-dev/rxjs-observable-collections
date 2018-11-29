//@flow
import * as a from './WeakMapAction';
import { ObservableWeakMap } from './ObservableWeakMap';
import { Subject } from 'rxjs';

type TypedSubject<K : {}, V : mixed> = rxjs$Subject<a.WeakMapAction<K,V>>;

/* This implementation is required when you wish to use a WeakMap but
 * you also wish to retain the ability to clear and/or replace it contents.
 *
 * This class wraps a normal observable weak map, but provides custom
 * implementations of clear and replace functionality.  It also ensures
 * continuity of the actions stream if the contents are cleared/replaced.
 */

export class ObservableClearableWeakMapWrapper<K : {}, V : mixed> {
    #wrapped : ObservableWeakMap<K,V>;
    //$FlowFixMe
    #subject : TypedSubject<K,V>;
    #subscription : rxjs$Subscription;

    get actions() { return this.#subject; }
    get length() {
        // According to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap#Properties
        // this is always zero. Oddly, FlowJS doesn't think it exists on the wrapped instance.
        return 0;
    }

    set(key : K, value : V) : WeakMap<K,V> { return this.#wrapped.set(key, value); }
    get(key : K) : ?V { return this.#wrapped.get(key); }
    delete(key : K) : bool { return this.#wrapped.delete(key); }
    has(key : K) : bool { return this.#wrapped.has(key); }

    clear() : void {
        this.#subscription.unsubscribe();
        this.#wrapped = new ObservableWeakMap();
        this.#subscription = this.#wrapped.actions.subscribe(action => this.#subject.next(action));

        const action = new a.WeakMapClearAction(this.#wrapped);
        this.#subject.next(action);
    }
    
    replaceContents(newContents : Iterable<[K,V]>) : void {
        this.#subscription.unsubscribe();
        this.#wrapped = new ObservableWeakMap(newContents);
        this.#subscription = this.#wrapped.actions.subscribe(action => this.#subject.next(action));

        const action = new a.WeakMapReplaceContentsAction(this.#wrapped);
        this.#subject.next(action);
    }

    constructor(source? : Iterable<[K,V]>) {
        this.#wrapped = new ObservableWeakMap(source);
        this.#subject = new Subject();
        this.#subscription = this.#wrapped.actions.subscribe(action => this.#subject.next(action));
    }

}
