//@flow
import { ObservableWeakSet } from './ObservableWeakSet';
import * as a from './WeakSetAction';

describe('The observable weak set', () => {
    let sub : ?rxjs$Subscription = null;
    let lastAction : ?a.WeakSetAction<number> = null;

    const item1 = { foo: 1 }, item2 = { foo: 2 };

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
            const sut = new ObservableWeakSet([item1, item2]);
            expect(sut.has(item1)).toBeTruthy();
        });

        it('should not be affected by subsequent changes made to the array instance which is passed', () => {
            const src = [item1];
            const sut = new ObservableWeakSet(src);
            src.push(item2);
            expect(sut.has(item2)).toBeFalsy();
        });

        it('should expose an \'initial state\' action, when no other mutation has occurred', () => {
            const sut = new ObservableWeakSet([item1, item2]);
            setupActionSubscription(sut);

            const action = getLastAction(a.WeakSetInitialStateAction);
            expect(action.type).toBe(a.WeakSetActions.initialState);
            expect(action.set).toBe(sut);
        });
    });

    describe('add function', () => {
        it('should add a value to the instance', () => {
            const sut = new ObservableWeakSet([item1]);
            sut.add(item2);
            expect(sut.has(item2)).toBeTruthy();
        });

        it('should emit an appropriate action', () => {
            const sut = new ObservableWeakSet([item1]);
            setupActionSubscription(sut);
            sut.add(item2);

            const action = getLastAction(a.WeakSetAddAction);
            expect(action.type).toBe(a.WeakSetActions.add);
            expect(action.value).toBe(item2);
            expect(action.set).toBe(sut);
        });

        it('should not emit an action if the item is already container', () => {
            const sut = new ObservableWeakSet([item1]);
            setupActionSubscription(sut);
            sut.add(item1);

            // The last action is an initial state action because the deletion didn't raise a new one
            const action = getLastAction(a.WeakSetInitialStateAction);
            expect(action.type).toBe(a.WeakSetActions.initialState);
        });
    });

    describe('delete function', () => {
        it('should delete an item from the instance', () => {
            const sut = new ObservableWeakSet([item1, item2]);
            sut.delete(item2);
            expect(sut.has(item2)).toBeFalsy();
        });

        it('should emit an appropriate action when an item is deleted', () => {
            const sut = new ObservableWeakSet([item1, item2]);
            setupActionSubscription(sut);
            sut.delete(item2);

            const action = getLastAction(a.WeakSetDeleteAction);
            expect(action.type).toBe(a.WeakSetActions.delete);
            expect(action.value).toBe(item2);
            expect(action.set).toBe(sut);
        });

        it('should not emit an action when no item is deleted', () => {
            const sut = new ObservableWeakSet([item1]);
            setupActionSubscription(sut);
            sut.delete(item2);

            // The last action is an initial state action because the deletion didn't raise a new one
            const action = getLastAction(a.WeakSetInitialStateAction);
            expect(action.type).toBe(a.WeakSetActions.initialState);
        });
    });
    
    function setupActionSubscription<T : {}>(sut : ObservableWeakSet<T>) {
        sub = sut.actions.subscribe(action => lastAction = action);
    }

    function getLastAction<T : a.WeakSetAction<number>>(expected : Class<T>) : T {
        if(!lastAction) throw new Error('Last action must not be null');

        if(lastAction instanceof expected)
            return lastAction;

        if(!(lastAction instanceof a.WeakSetAction))
        {
            throw new Error(`Last action must be an action instance (likely a test error)
Actual: ${lastAction.toString()}`);
        }

        throw new Error(`Last action must be of the requested type
Requested:  ${expected.name}
Actual:     ${lastAction.constructor.name}`);
    }
});