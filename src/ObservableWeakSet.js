//@flow
import * as a from './WeakSetAction';
import { BehaviorSubject } from 'rxjs';

export class ObservableWeakSet<T : {}> extends WeakSet<T> {
    #subject : rxjs$Subject<a.WeakSetAction<T>>;

    get actions() : rxjs$Observable<a.WeakSetAction<T>> { return this.#subject; }

    add(value : T) : WeakSet<T> {
        const alreadyPresent = super.has(value);
        if(!alreadyPresent) {
            super.add(value);
            const action = new a.WeakSetAddAction(this, value);
            this.#subject.next(action);
        }
        return this;
    }

    delete(value : T) : bool {
        const deleted = super.delete(value);

        if(deleted) {
            const action = new a.WeakSetDeleteAction(this, value);
            this.#subject.next(action);
        }

        return deleted;
    }

    constructor(source? : Iterable<T>) {
        /* We can't call the original constructor of the superclass Set because, internally
         * it makes use of this class' .add function, which we have overridden.
         * 
         * Instead, if there are source items, we manually add them via the superclass'
         * own .add function.
         */
        super();

        if(source) {
            for (const value of source) super.add(value);
        }

        const initialAction = new a.WeakSetInitialStateAction<T>(this);
        this.#subject = new BehaviorSubject(initialAction);
    }
}