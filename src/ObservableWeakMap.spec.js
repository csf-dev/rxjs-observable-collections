//@flow
import { ObservableWeakMap } from './ObservableWeakMap';
import * as a from './WeakMapAction';

describe('The observable weak map', () => {
    let sub : ?rxjs$Subscription = null;
    let lastAction : ?a.WeakMapAction<{foo : number},number> = null;

    const key1 = { foo: 1 }, key2 = { foo: 2 }, key3 = { foo: 3 };

    afterEach(() => {
        if(sub)
        {
            sub.unsubscribe();
            sub = null;
        }

        if(lastAction) lastAction = null;
    });

    describe('constructor', () => {
        it('should initialise with the given items if they are passed', () => {
            const sut = new ObservableWeakMap([[key1, 1], [key2, 2]]);
            expect(sut.has(key1)).toBeTruthy();
        });

        it('should not be affected by subsequent changes made to the array instance which is passed', () => {
            const src = [[key1, 1], [key2, 2]];
            const sut = new ObservableWeakMap(src);
            src.push([key3, 3]);
            expect(sut.has(key3)).toBeFalsy();
        });

        it('should expose an \'initial state\' action, when no other mutation has occurred', () => {
            const sut = new ObservableWeakMap([[key1, 1], [key2, 2]]);
            setupActionSubscription(sut);

            const action = getLastAction(a.WeakMapInitialStateAction);
            expect(action.type).toBe(a.WeakMapActions.initialState);
            expect(action.map).toBe(sut);
        });
    });
    describe('set function', () => {
        it('should be able to add a value to the instance', () => {
            const sut = new ObservableWeakMap([[key1, 1], [key2, 2]]);
            sut.set(key3, 3);
            expect(sut.has(key3)).toBeTruthy();
        });

        it('should emit an appropriate action', () => {
            const sut = new ObservableWeakMap([[key1, 1], [key2, 2]]);
            setupActionSubscription(sut);
            sut.set(key3, 3);

            const action = getLastAction(a.WeakMapSetAction);
            expect(action.type).toBe(a.WeakMapActions.set);
            expect(action.key).toEqual(key3);
            expect(action.value).toEqual(3);
            expect(action.newKey).toBeTruthy();
            expect(action.map).toBe(sut);
        });

        it('should indicate in the action when the key previously existed in the map', () => {
            const sut = new ObservableWeakMap([[key1, 1], [key2, 2]]);
            setupActionSubscription(sut);
            sut.set(key2, 5);

            const action = getLastAction(a.WeakMapSetAction);
            expect(action.type).toBe(a.WeakMapActions.set);
            expect(action.key).toEqual(key2);
            expect(action.value).toEqual(5);
            expect(action.newKey).toBeFalsy();
            expect(action.map).toBe(sut);
        });
    });

    describe('delete function', () => {
        it('should delete an item from the instance', () => {
            const sut = new ObservableWeakMap([[key1, 1], [key2, 2]]);
            sut.delete(key2);
            expect(sut.has(key2)).toBeFalsy();
        });

        it('should emit an appropriate action when an item is deleted', () => {
            const sut = new ObservableWeakMap([[key1, 1], [key2, 2]]);
            setupActionSubscription(sut);
            sut.delete(key2);

            const action = getLastAction(a.WeakMapDeleteAction);
            expect(action.type).toBe(a.WeakMapActions.delete);
            expect(action.key).toEqual(key2);
            expect(action.map).toBe(sut);
        });

        it('should not emit an action when no item is deleted', () => {
            const sut = new ObservableWeakMap([[key1, 1], [key2, 2]]);
            setupActionSubscription(sut);
            sut.delete(key3);

            // The last action is an initial state action because the deletion didn't raise a new one
            const action = getLastAction(a.WeakMapInitialStateAction);
            expect(action.type).toBe(a.WeakMapActions.initialState);
        });
    });
    
    function setupActionSubscription<K : {}, V : mixed>(sut : ObservableWeakMap<K,V>) {
        sub = sut.actions.subscribe(action => lastAction = action);
    }

    function getLastAction<T : a.WeakMapAction<{foo : number},number>>(expected : Class<T>) : T {
        if(!lastAction) throw new Error('Last action must not be null');

        if(lastAction instanceof expected)
            return lastAction;

        if(!(lastAction instanceof a.WeakMapAction))
        {
            throw new Error(`Last action must be an action instance (likely a test error)
Actual: ${lastAction.toString()}`);
        }

        throw new Error(`Last action must be of the requested type
Requested:  ${expected.name}
Actual:     ${lastAction.constructor.name}`);
    }
});