//@flow
import * as a from './WeakSetAction';
import { ObservableWeakSet } from './ObservableWeakSet';
import { Subject } from 'rxjs';

export class ObservableClearableWeakSetWrapper<T : {}> {
    #wrapped : ObservableWeakSet<T>;
    #subject : rxjs$Subject<a.WeakSetAction<T>>;
    #subscription : rxjs$Subscription;

    get actions() { return this.#subject; }
    get length() {
        // According to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet#Properties
        // this is always zero. Oddly, FlowJS doesn't think it exists on the wrapped instance.
        return 0;
    }

    add(value : T) : WeakSet<T> { return this.#wrapped.add(value); }
    delete(value : T) : bool { return this.#wrapped.delete(value); }
    has(value : T) : bool { return this.#wrapped.has(value); }

    clear() : void {
        this.#subscription.unsubscribe();
        this.#wrapped = new ObservableWeakSet();
        this.#subscription = this.#wrapped.actions.subscribe(action => this.#subject.next(action));

        const action = new a.WeakSetClearAction(this.#wrapped);
        this.#subject.next(action);
    }

    replaceContents(newContents : Iterable<T>) : void {
        this.#subscription.unsubscribe();
        this.#wrapped = new ObservableWeakSet(newContents);
        this.#subscription = this.#wrapped.actions.subscribe(action => this.#subject.next(action));

        const action = new a.WeakSetReplaceContentsAction(this.#wrapped);
        this.#subject.next(action);
    }

    constructor(source? : Iterable<T>) {
        this.#wrapped = new ObservableWeakSet(source);
        this.#subject = new Subject();
        this.#subscription = this.#wrapped.actions.subscribe(action => this.#subject.next(action));
    }

}
