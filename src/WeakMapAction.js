//@flow
import { ObservableWeakMap } from './ObservableWeakMap';

export const WeakMapActions = {
    // Standard mutator functions
    set: 'set',
    delete: 'delete',
    // Extra mutation methods
    initialState: 'initialState'
};

export type WeakMapActionName = $Keys<typeof WeakMapActions>;

export class WeakMapAction<K : {}, V : mixed> {
    #type : WeakMapActionName;
    #map : ObservableWeakMap<K,V>;

    get type() { return this.#type; }
    get map() : ObservableWeakMap<K,V> { return this.#map; }

    constructor(type : WeakMapActionName, map : ObservableWeakMap<K,V>) {
        this.#type = type;
        this.#map = map;
    }
}

export class WeakMapSetAction<K : {}, V : mixed> extends WeakMapAction<K,V> {
    key : K
    value : V;
    newKey : bool;

    constructor(map : ObservableWeakMap<K,V>, key : K, value : V, newKey : bool) {
        super(WeakMapActions.set, map);

        this.key = key;
        this.value = value;
        this.newKey = newKey;
    }
}

export class WeakMapDeleteAction<K : {}, V : mixed> extends WeakMapAction<K,V> {
    key : K

    constructor(map : ObservableWeakMap<K,V>, key : K) {
        super(WeakMapActions.delete, map);

        this.key = key;
    }
}

export class WeakMapInitialStateAction<K : {}, V : mixed> extends WeakMapAction<K,V> {
    constructor(map : ObservableWeakMap<K,V>) {
        super(WeakMapActions.initialState, map);
    }
}

