//@flow
import { ObservableWeakSet } from './ObservableWeakSet';

export const WeakSetActions = {
    // Standard mutator functions
    add: 'add',
    delete: 'delete',
    // Extra mutation methods
    initialState: 'initialState',
    // Extra actions for the clearable wrapper only
    clear: 'clear',
    replaceContents: 'replaceContents',
};

export type WeakSetActionName = $Keys<typeof WeakSetActions>;

export class WeakSetAction<T : {}> {
    #type : WeakSetActionName;
    #set : ObservableWeakSet<T>;

    get type() { return this.#type; }
    get set() : ObservableWeakSet<T> { return this.#set; }

    constructor(type : WeakSetActionName, set : ObservableWeakSet<T>) {
        this.#type = type;
        this.#set = set;
    }
}

export class WeakSetAddAction<T : {}> extends WeakSetAction<T> {
    value : T;

    constructor(set : ObservableWeakSet<T>, value : T) {
        super(WeakSetActions.add, set);

        this.value = value;
    }
}

export class WeakSetDeleteAction<T : {}> extends WeakSetAction<T> {
    value : T;

    constructor(set : ObservableWeakSet<T>, value : T) {
        super(WeakSetActions.delete, set);

        this.value = value;
    }
}

export class WeakSetClearAction<T : {}> extends WeakSetAction<T> {
    constructor(set : ObservableWeakSet<T>) {
        super(WeakSetActions.clear, set);
    }
}

export class WeakSetReplaceContentsAction<T : {}> extends WeakSetAction<T> {
    constructor(set : ObservableWeakSet<T>) {
        super(WeakSetActions.replaceContents, set);
    }
}

export class WeakSetInitialStateAction<T : {}> extends WeakSetAction<T> {
    constructor(set : ObservableWeakSet<T>) {
        super(WeakSetActions.initialState, set);
    }
}

