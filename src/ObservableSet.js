//@flow
import * as a from './SetAction';
import { BehaviorSubject } from 'rxjs';

export class ObservableSet<T : mixed> extends Set<T> {
    #subject : rxjs$Subject<a.SetAction<T>>;

    get actions() : rxjs$Observable<a.SetAction<T>> { return this.#subject; }

    add(value : T) : Set<T> {
        super.add(value);
        const action = new a.SetAddAction(this, value);
        this.#subject.next(action);
        return this;
    }

    clear() : void {
        const previousValues = new Set(super.values());
        super.clear();
        const action = new a.SetClearAction(this, previousValues);
        this.#subject.next(action);
    }

    delete(value : T) : bool {
        const deleted = super.delete(value);

        if(deleted) {
            const action = new a.SetDeleteAction(this, value);
            this.#subject.next(action);
        }

        return deleted;
    }

    replaceContents(newContents : Iterable<T>) : Iterable<T> {
        const previousValues = new Set(super.values());

        super.clear();
        for (const value of newContents) super.add(value);

        const action = new a.SetReplaceContentsAction(this, previousValues);
        this.#subject.next(action);
        return previousValues;
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

        const initialAction = new a.SetInitialStateAction<T>(this);
        this.#subject = new BehaviorSubject(initialAction);
    }
}