//@flow
import { ObservableSet } from './ObservableSet';
import * as a from './SetAction';

describe('The observable set', () => {
    let sub : ?rxjs$Subscription = null;
    let lastAction : ?a.SetAction<number> = null;

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
            const sut = new ObservableSet();
            expect(Array.from(sut.values())).toEqual([]);
        });

        it('should initialise with the given items if they are passed', () => {
            const sut = new ObservableSet([1, 2, 3]);
            expect(Array.from(sut.values())).toEqual([1, 2, 3]);
        });

        it('should not be affected by subsequent changes made to the array instance which is passed', () => {
            const src = [1,2,3];
            const sut = new ObservableSet(src);
            src.push(4);
            expect(Array.from(sut.values())).toEqual([1, 2, 3]);
        });

        it('should expose an \'initial state\' action, when no other mutation has occurred', () => {
            const sut = new ObservableSet([1, 2, 3]);
            setupActionSubscription(sut);

            const action = getLastAction(a.SetInitialStateAction);
            expect(action.type).toBe(a.SetActions.initialState);
            expect(action.set).toBe(sut);
        });
    });

    describe('replaceContents function', () => {
        it('should replace the contents of the instance', () => {
            const sut = new ObservableSet<number>([1, 2, 3, 4]);
            sut.replaceContents([5, 6, 7]);
            expect(Array.from(sut.values())).toEqual([5, 6, 7]);
        });

        it('should emit an appropriate action', () => {
            const sut = new ObservableSet<number>([1, 2, 3, 4]);
            setupActionSubscription(sut);
            sut.replaceContents([5, 6, 7]);

            const action = getLastAction(a.SetReplaceContentsAction);
            expect(action.type).toBe(a.SetActions.replaceContents);
            expect(Array.from(action.previousValues)).toEqual([1, 2, 3, 4]);
            expect(action.set).toBe(sut);
        });
    });

    describe('clear function', () => {
        it('should clear the instance', () => {
            const sut = new ObservableSet<number>([1, 2, 3, 4]);
            sut.clear();
            expect(Array.from(sut.values())).toEqual([]);
        });

        it('should emit an appropriate action', () => {
            const sut = new ObservableSet<number>([1, 2, 3, 4]);
            setupActionSubscription(sut);
            sut.clear();

            const action = getLastAction(a.SetClearAction);
            expect(action.type).toBe(a.SetActions.clear);
            expect(Array.from(action.previousValues)).toEqual([1, 2, 3, 4]);
            expect(action.set).toBe(sut);
        });
    });

    describe('add function', () => {
        it('should add a value to the instance', () => {
            const sut = new ObservableSet<number>([1, 2, 3, 4]);
            sut.add(5);
            expect(Array.from(sut.values())).toEqual([1, 2, 3, 4, 5]);
        });

        it('should emit an appropriate action', () => {
            const sut = new ObservableSet<number>([1, 2, 3, 4]);
            setupActionSubscription(sut);
            sut.add(5);

            const action = getLastAction(a.SetAddAction);
            expect(action.type).toBe(a.SetActions.add);
            expect(action.value).toEqual(5);
            expect(action.set).toBe(sut);
        });

        it('should not emit an action if the item is already container', () => {
            const sut = new ObservableSet<number>([1, 2, 3, 4]);
            setupActionSubscription(sut);
            sut.add(4);

            // The last action is an initial state action because the deletion didn't raise a new one
            const action = getLastAction(a.SetInitialStateAction);
            expect(action.type).toBe(a.SetActions.initialState);
        });
    });

    describe('delete function', () => {
        it('should delete an item from the instance', () => {
            const sut = new ObservableSet<number>([1, 2, 3, 4]);
            sut.delete(3);
            expect(Array.from(sut.values())).toEqual([1, 2, 4]);
        });

        it('should emit an appropriate action when an item is deleted', () => {
            const sut = new ObservableSet<number>([1, 2, 3, 4]);
            setupActionSubscription(sut);
            sut.delete(3);

            const action = getLastAction(a.SetDeleteAction);
            expect(action.type).toBe(a.SetActions.delete);
            expect(action.value).toEqual(3);
            expect(action.set).toBe(sut);
        });

        it('should not emit an action when no item is deleted', () => {
            const sut = new ObservableSet<number>([1, 2, 3, 4]);
            setupActionSubscription(sut);
            sut.delete(66);

            // The last action is an initial state action because the deletion didn't raise a new one
            const action = getLastAction(a.SetInitialStateAction);
            expect(action.type).toBe(a.SetActions.initialState);
        });
    });
    
    function setupActionSubscription<T : mixed>(sut : ObservableSet<T>) {
        sub = sut.actions.subscribe(action => lastAction = action);
    }

    function getLastAction<T : a.SetAction<number>>(expected : Class<T>) : T {
        if(!lastAction) throw new Error('Last action must not be null');

        if(lastAction instanceof expected)
            return lastAction;

        if(!(lastAction instanceof a.SetAction))
        {
            throw new Error(`Last action must be an action instance (likely a test error)
Actual: ${lastAction.toString()}`);
        }

        throw new Error(`Last action must be of the requested type
Requested:  ${expected.name}
Actual:     ${lastAction.constructor.name}`);
    }
});