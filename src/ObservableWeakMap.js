//@flow
import * as a from './WeakMapAction';
import { BehaviorSubject } from 'rxjs';

export class ObservableWeakMap<K : {}, V : mixed> extends WeakMap<K,V> {
    #subject : rxjs$Subject<a.WeakMapAction<K,V>>;

    get actions() : rxjs$Observable<a.WeakMapAction<K,V>> { return this.#subject; }

    set(key : K, value : V) : WeakMap<K,V> {
        super.set(key, value);
        const action = new a.WeakMapSetAction(this, key, value);
        this.#subject.next(action);
        return this;
    }

    delete(key : K) : bool {
        const deleted = super.delete(key);

        if(deleted) {
            const action = new a.WeakMapDeleteAction(this, key);
            this.#subject.next(action);
        }

        return deleted;
    }

    constructor(source? : Iterable<[K,V]>) {
        /* We can't call the original constructor of the superclass Set because, internally
         * it makes use of this class' .set function, which we have overridden.
         * 
         * Instead, if there are source items, we manually add them via the superclass'
         * own .add function.
         */
        super();

        if(source) {
            for (const kvp of source) super.set(kvp[0], kvp[1]);
        }

        const initialAction = new a.WeakMapInitialStateAction<K,V>(this);
        this.#subject = new BehaviorSubject(initialAction);
    }
}