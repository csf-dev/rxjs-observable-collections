//@flow
import { ObservableArray } from './ObservableArray';

export const ArrayActions = {
    // Standard mutator functions
    copyWithin: 'copyWithin',
    fill: 'fill',
    pop: 'pop',
    push: 'push',
    reverse: 'reverse',
    shift: 'shift',
    sort: 'sort',
    splice: 'splice',
    unshift: 'unshift',
    // Extra mutation methods
    replaceContents: 'replaceContents',
    resize: 'resize',
    setItem: 'setItem',
    initialState: 'initialState'
};

type ArrayActionName = $Keys<typeof ArrayActions>;

export class ArrayAction<T : mixed> {
    #type : ArrayActionName;
    #array : ObservableArray<T>;

    get type() { return this.#type; }
    get array() : ObservableArray<T> { return this.#array; }

    constructor(type : ArrayActionName, array : ObservableArray<T>) {
        this.#type = type;
        this.#array = array;
    }
}

export class ArrayCopyWithinAction<T : mixed> extends ArrayAction<T> {
    target : number;
    start : number;
    end : ?number;

    constructor(array : ObservableArray<T>, target : number, start : number, end : ?number) {
        super(ArrayActions.copyWithin, array);

        this.target = target;
        this.start = start;
        this.end = end;
    }
}

export class ArrayFillAction<T : mixed> extends ArrayAction<T> {
    value : T;
    start : ?number;
    end : ?number;

    constructor(array : ObservableArray<T>, value : T, start : ?number, end : ?number) {
        super(ArrayActions.fill, array);

        this.value = value;
        this.start = start;
        this.end = end;
    }
}

export class ArrayPopAction<T : mixed> extends ArrayAction<T> {
    constructor(array : ObservableArray<T>) {
        super(ArrayActions.pop, array);
    }
}

export class ArrayPushAction<T : mixed> extends ArrayAction<T> {
    elements : Array<T>;

    constructor(array : ObservableArray<T>, elements : Array<T>) {
        super(ArrayActions.push, array);

        this.elements = elements;
    }
}

export class ArrayReverseAction<T : mixed> extends ArrayAction<T> {
    constructor(array : ObservableArray<T>) {
        super(ArrayActions.reverse, array);
    }
}

export class ArrayShiftAction<T : mixed> extends ArrayAction<T> {
    constructor(array : ObservableArray<T>) {
        super(ArrayActions.shift, array);
    }
}

export class ArraySortAction<T : mixed> extends ArrayAction<T> {
    compareFunction : ?(a : T, b : T) => number;

    constructor(array : ObservableArray<T>, compareFunction : ?(a : T, b : T) => number) {
        super(ArrayActions.sort, array);

        this.compareFunction = compareFunction;
    }
}

export class ArraySpliceAction<T : mixed> extends ArrayAction<T> {
    start : number;
    deleteCount : ?number;
    items : ?Array<T>;

    constructor(array : ObservableArray<T>, start : number, deleteCount : ?number, items : ?Array<T>) {
        super(ArrayActions.splice, array);

        this.start = start;
        this.deleteCount = deleteCount;
        this.items = items;
    }
}

export class ArrayUnshiftAction<T : mixed> extends ArrayAction<T> {
    elements : Array<T>;

    constructor(array : ObservableArray<T>, elements : Array<T>) {
        super(ArrayActions.unshift, array);

        this.elements = elements;
    }
}

export class ArrayReplaceContentsAction<T : mixed> extends ArrayAction<T> {
    previousValues : Array<T>;

    constructor(array : ObservableArray<T>, previousValues : Array<T>) {
        super(ArrayActions.replaceContents, array);

        this.previousValues = previousValues;
    }
}

export class ArrayInitialStateAction<T : mixed> extends ArrayAction<T> {
    constructor(array : ObservableArray<T>) {
        super(ArrayActions.initialState, array);
    }
}
export class ArrayResizeAction<T : mixed> extends ArrayAction<T> {
    newLength : number;

    constructor(array : ObservableArray<T>, newLength : number) {
        super(ArrayActions.resize, array);

        this.newLength = newLength;
    }
}

export class ArraySetItemAction<T : mixed> extends ArrayAction<T> {
    index : number;
    value : T;

    constructor(array : ObservableArray<T>, index : number, value : T) {
        super(ArrayActions.setItem, array);

        this.index = index;
        this.value = value;
    }
}

