//@flow
import { ObservableMap } from './ObservableMap';
import * as a from './MapAction';

describe('The observable map', () => {
    let sub : ?rxjs$Subscription = null;
    let lastAction : ?a.MapAction<string,number> = null;

    afterEach(() => {
        if(sub)
        {
            sub.unsubscribe();
            sub = null;
        }

        if(lastAction) lastAction = null;
    });

    describe('constructor', () => {
        it('should initialise in an empty state if no parameters are provided', () => {
            const sut = new ObservableMap();
            expect(Array.from(sut.entries())).toEqual([]);
        });

        it('should initialise with the given items if they are passed', () => {
            const sut = new ObservableMap([['a', 1], ['b', 2]]);
            expect(Array.from(sut.entries())).toEqual([['a', 1], ['b', 2]]);
        });

        it('should not be affected by subsequent changes made to the array instance which is passed', () => {
            const src = [['a', 1], ['b', 2]];
            const sut = new ObservableMap(src);
            src.push(['c', 3]);
            expect(Array.from(sut.entries())).toEqual([['a', 1], ['b', 2]]);
        });

        it('should expose an \'initial state\' action, when no other mutation has occurred', () => {
            const sut = new ObservableMap([['a', 1], ['b', 2]]);
            setupActionSubscription(sut);

            const action = getLastAction(a.MapInitialStateAction);
            expect(action.type).toBe(a.MapActions.initialState);
            expect(action.map).toBe(sut);
        });
    });

    describe('replaceContents function', () => {
        it('should replace the contents of the instance', () => {
            const sut = new ObservableMap([['a', 1], ['b', 2]]);
            sut.replaceContents([['c', 3], ['d', 4]]);
            expect(Array.from(sut.entries())).toEqual([['c', 3], ['d', 4]]);
        });

        it('should emit an appropriate action', () => {
            const sut = new ObservableMap([['a', 1], ['b', 2]]);
            setupActionSubscription(sut);
            sut.replaceContents([['c', 3], ['d', 4]]);

            const action = getLastAction(a.MapReplaceContentsAction);
            expect(action.type).toBe(a.MapActions.replaceContents);
            expect(Array.from(action.previousValues.entries())).toEqual([['a', 1], ['b', 2]]);
            expect(action.map).toBe(sut);
        });
    });

    describe('clear function', () => {
        it('should clear the instance', () => {
            const sut = new ObservableMap([['a', 1], ['b', 2]]);
            sut.clear();
            expect(Array.from(sut.entries())).toEqual([]);
        });

        it('should emit an appropriate action', () => {
            const sut = new ObservableMap([['a', 1], ['b', 2]]);
            setupActionSubscription(sut);
            sut.clear();

            const action = getLastAction(a.MapClearAction);
            expect(action.type).toBe(a.MapActions.clear);
            expect(Array.from(action.previousValues.entries())).toEqual([['a', 1], ['b', 2]]);
            expect(action.map).toBe(sut);
        });
    });

    describe('set function', () => {
        it('should add a value to the instance', () => {
            const sut = new ObservableMap([['a', 1], ['b', 2]]);
            sut.set('c', 3);
            expect(Array.from(sut.entries())).toEqual([['a', 1], ['b', 2], ['c', 3]]);
        });

        it('should emit an appropriate action', () => {
            const sut = new ObservableMap([['a', 1], ['b', 2]]);
            setupActionSubscription(sut);
            sut.set('c', 3);

            const action = getLastAction(a.MapSetAction);
            expect(action.type).toBe(a.MapActions.set);
            expect(action.key).toEqual('c');
            expect(action.value).toEqual(3);
            expect(action.map).toBe(sut);
        });
    });

    describe('delete function', () => {
        it('should delete an item from the instance', () => {
            const sut = new ObservableMap([['a', 1], ['b', 2]]);
            sut.delete('a');
            expect(Array.from(sut.entries())).toEqual([['b', 2]]);
        });

        it('should emit an appropriate action when an item is deleted', () => {
            const sut = new ObservableMap([['a', 1], ['b', 2]]);
            setupActionSubscription(sut);
            sut.delete('a');

            const action = getLastAction(a.MapDeleteAction);
            expect(action.type).toBe(a.MapActions.delete);
            expect(action.key).toEqual('a');
            expect(action.map).toBe(sut);
        });

        it('should not emit an action when no item is deleted', () => {
            const sut = new ObservableMap([['a', 1], ['b', 2]]);
            setupActionSubscription(sut);
            sut.delete('z');

            // The last action is an initial state action because the deletion didn't raise a new one
            const action = getLastAction(a.MapInitialStateAction);
            expect(action.type).toBe(a.MapActions.initialState);
        });
    });
    
    function setupActionSubscription<K : mixed, V : mixed>(sut : ObservableMap<K,V>) {
        sub = sut.actions.subscribe(action => lastAction = action);
    }

    function getLastAction<T : a.MapAction<string,number>>(expected : Class<T>) : T {
        if(!lastAction) throw new Error('Last action must not be null');

        if(lastAction instanceof expected)
            return lastAction;

        if(!(lastAction instanceof a.MapAction))
        {
            throw new Error(`Last action must be an action instance (likely a test error)
Actual: ${lastAction.toString()}`);
        }

        throw new Error(`Last action must be of the requested type
Requested:  ${expected.name}
Actual:     ${lastAction.constructor.name}`);
    }
});