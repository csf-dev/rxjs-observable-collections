//@flow
import { ObservableSet } from './ObservableSet';

export const SetActions = {
    // Standard mutator functions
    add: 'add',
    clear: 'clear',
    delete: 'delete',
    // Extra mutation methods
    replaceContents: 'replaceContents',
    initialState: 'initialState'
};

type SetActionName = $Keys<typeof SetActions>;

export class SetAction<T : mixed> {
    #type : SetActionName;
    #set : ObservableSet<T>;

    get type() { return this.#type; }
    get set() : ObservableSet<T> { return this.#set; }

    constructor(type : SetActionName, set : ObservableSet<T>) {
        this.#type = type;
        this.#set = set;
    }
}

export class SetAddAction<T : mixed> extends SetAction<T> {
    value : T;

    constructor(set : ObservableSet<T>, value : T) {
        super(SetActions.add, set);

        this.value = value;
    }
}

export class SetClearAction<T : mixed> extends SetAction<T> {
    previousValues : Set<T>;

    constructor(set : ObservableSet<T>, previousValues : Set<T>) {
        super(SetActions.clear, set);

        this.previousValues = previousValues;
    }
}

export class SetDeleteAction<T : mixed> extends SetAction<T> {
    value : T;

    constructor(set : ObservableSet<T>, value : T) {
        super(SetActions.delete, set);

        this.value = value;
    }
}

export class SetReplaceContentsAction<T : mixed> extends SetAction<T> {
    previousValues : Set<T>;

    constructor(set : ObservableSet<T>, previousValues : Set<T>) {
        super(SetActions.replaceContents, set);

        this.previousValues = previousValues;
    }
}

export class SetInitialStateAction<T : mixed> extends SetAction<T> {
    constructor(set : ObservableSet<T>) {
        super(SetActions.initialState, set);
    }
}

