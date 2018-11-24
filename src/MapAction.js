//@flow
import { ObservableMap } from './ObservableMap';

export const MapActions = {
    // Standard mutator functions
    set: 'set',
    clear: 'clear',
    delete: 'delete',
    // Extra mutation methods
    replaceContents: 'replaceContents',
    initialState: 'initialState'
};

export type MapActionName = $Keys<typeof MapActions>;

export class MapAction<K : mixed, V : mixed> {
    #type : MapActionName;
    #map : ObservableMap<K,V>;

    get type() { return this.#type; }
    get map() : ObservableMap<K,V> { return this.#map; }

    constructor(type : MapActionName, map : ObservableMap<K,V>) {
        this.#type = type;
        this.#map = map;
    }
}

export class MapSetAction<K : mixed, V : mixed> extends MapAction<K,V> {
    key : K
    value : V;
    newKey : bool;

    constructor(map : ObservableMap<K,V>, key : K, value : V, newKey : bool) {
        super(MapActions.set, map);

        this.key = key;
        this.value = value;
        this.newKey = newKey;
    }
}

export class MapClearAction<K : mixed, V : mixed> extends MapAction<K,V> {
    previousValues : Map<K,V>;

    constructor(map : ObservableMap<K,V>, previousValues : Map<K,V>) {
        super(MapActions.clear, map);

        this.previousValues = previousValues;
    }
}

export class MapDeleteAction<K : mixed, V : mixed> extends MapAction<K,V> {
    key : K

    constructor(map : ObservableMap<K,V>, key : K) {
        super(MapActions.delete, map);

        this.key = key;
    }
}

export class MapReplaceContentsAction<K : mixed, V : mixed> extends MapAction<K,V> {
    previousValues : Map<K,V>;

    constructor(map : ObservableMap<K,V>, previousValues : Map<K,V>) {
        super(MapActions.replaceContents, map);

        this.previousValues = previousValues;
    }
}

export class MapInitialStateAction<K : mixed, V : mixed> extends MapAction<K,V> {
    constructor(map : ObservableMap<K,V>) {
        super(MapActions.initialState, map);
    }
}

