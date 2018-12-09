//@flow
import * as a from './MapAction';
import { BehaviorSubject } from 'rxjs';

export class ObservableMap<K : mixed, V : mixed> extends Map<K,V> {
    #subject : rxjs$Subject<a.MapAction<K,V>>;

    get actions() : rxjs$Observable<a.MapAction<K,V>> { return this.#subject; }

    set(key : K, value : V) : Map<K,V> {
        const newKey = !super.has(key);
        super.set(key, value);
        const action = new a.MapSetAction(this, key, value, newKey);
        this.#subject.next(action);
        return this;
    }

    clear() : void {
        const previousValues = new Map(super.entries());
        super.clear();
        const action = new a.MapClearAction(this, previousValues);
        this.#subject.next(action);
    }

    delete(key : K) : bool {
        const deleted = super.delete(key);

        if(deleted) {
            const action = new a.MapDeleteAction(this, key);
            this.#subject.next(action);
        }

        return deleted;
    }

    replaceContents(newContents : Iterable<[K,V]>) : Iterable<[K,V]> {
        const previousValues = new Map(super.entries());

        super.clear();
        for (const kvp of newContents) super.set(kvp[0], kvp[1]);

        const action = new a.MapReplaceContentsAction(this, previousValues);
        this.#subject.next(action);
        return previousValues;
    }

    constructor(source? : Iterable<[K,V]>) {
        /* We can't call the original constructor of the superclass Set because, internally
         * it makes use of this class' .add function, which we have overridden.
         * 
         * Instead, if there are source items, we manually add them via the superclass'
         * own .add function.
         */
        super();

        if(source) {
            for (const kvp of source) super.set(kvp[0], kvp[1]);
        }

        const initialAction = new a.MapInitialStateAction<K,V>(this);
        this.#subject = new BehaviorSubject(initialAction);
    }
}