//@flow
import { ObservableArray } from './ObservableArray';
import * as a from './ArrayAction';
import { map } from 'rxjs/operators';

describe('The observable array', () => {
    let sub : ?rxjs$Subscription = null;
    let lastAction : ?a.ArrayAction<number> = null;

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
            const sut = new ObservableArray();
            expect(sut.length).toBe(0);
        });

        it('should initialise with the given items if they are passed', () => {
            const sut = new ObservableArray([1, 2, 3]);
            expect(sut).toEqual([1, 2, 3]);
        });

        it('should not be affected by subsequent changes made to the array instance which is passed', () => {
            const src = [1,2,3];
            const sut = new ObservableArray(src);
            src.push(4);
            expect(sut).toEqual([1, 2, 3]);
        });

        it('should expose an \'initial state\' action, when no other mutation has occurred', () => {
            const sut = new ObservableArray([1, 2, 3]);
            setupActionSubscription(sut);

            const action = getLastAction(a.ArrayInitialStateAction);
            expect(action.type).toBe(a.ArrayActions.initialState);
        });

        it('should expose the correct initial value via its actions, when no other mutation has occurred', () => {
            const sut = new ObservableArray([1, 2, 3]);
            setupActionSubscription(sut);

            const action = getLastAction(a.ArrayInitialStateAction);
            expect(action.array).toEqual([1, 2, 3]);
        });
    });

    describe('setItem function', () => {
        it('should be able to set an item outside the bounds of the array', () => {
            const sut = new ObservableArray<number>();
            sut.setItem(2, 55);
            expect(sut).toEqual([undefined, undefined, 55]);
        });

        it('should be able to set an item inside the bounds of the array', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            sut.setItem(2, 55);
            expect(sut).toEqual([1, 2, 55, 4]);
        });

        it('should emit a set-item action from its actions observable with the correct state', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            setupActionSubscription(sut);

            sut.setItem(2, 55);

            const action = getLastAction(a.ArraySetItemAction);
            expect(action.type).toBe(a.ArrayActions.setItem);
            expect(action.array).toBe(sut);
            expect(action.index).toBe(2);
            expect(action.value).toBe(55);
        });
    });

    describe('length property', () => {
        it('should contain the correct value for an initial state', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            expect(sut.length).toBe(4);
        });

        it('should contain the correct value after a new item is added', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            sut.push(5, 6);
            expect(sut.length).toBe(6);
        });

        it('should contain the correct value after the contents are replaced', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            sut.replaceContents([5, 6]);
            expect(sut.length).toBe(2);
        });

        it('should truncate the array when set to a smaller value than the current length', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            sut.length = 2;
            expect(sut).toEqual([1, 2]);
        });

        it('should leave undefined items when set to a larger value than the current length', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            sut.length = 6;
            expect(sut).toEqual([1, 2, 3, 4, undefined, undefined]);
        });
    });

    describe('resize function', () => {
        it('should truncate the array when set to a smaller value than the current length', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            sut.resize(2);
            expect(sut).toEqual([1, 2]);
        });

        it('should leave undefined items when set to a larger value than the current length', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            sut.resize(6);
            expect(sut).toEqual([1, 2, 3, 4, undefined, undefined]);
        });

        it('should emit a resize action when it is set', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            setupActionSubscription(sut);
            sut.resize(2);

            const action = getLastAction(a.ArrayResizeAction);
            expect(action.type).toBe(a.ArrayActions.resize);
            expect(action.array).toBe(sut);
            expect(action.newLength).toBe(2);
        });
    });

    describe('replaceContents function', () => {
        it('should replace the contents of the array', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            sut.replaceContents([5, 6, 7]);
            expect(sut).toEqual([5, 6, 7]);
        });

        it('should emit an appropriate action', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            setupActionSubscription(sut);
            sut.replaceContents([5, 6, 7]);

            const action = getLastAction(a.ArrayReplaceContentsAction);
            expect(action.type).toBe(a.ArrayActions.replaceContents);
            expect(action.previousValues).toEqual([1, 2, 3, 4]);
            expect(action.array).toBe(sut);
        });
    });

    describe('copyWithin function', () => {
        it('should behave the same as the native function of the same name', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4, 5]);
            sut.copyWithin(3, 0, 2);
            expect(sut).toEqual([1, 2, 3, 1, 2]);
        });

        it('should emit an appropriate action', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            setupActionSubscription(sut);
            sut.copyWithin(1, 2, 3);

            const action = getLastAction(a.ArrayCopyWithinAction);
            expect(action.type).toBe(a.ArrayActions.copyWithin);
            expect(action.target).toEqual(1);
            expect(action.start).toEqual(2);
            expect(action.end).toEqual(3);
            expect(action.array).toBe(sut);
        });
    });

    describe('fill function', () => {
        it('should behave the same as the native function of the same name', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            sut.fill(6, 1, 3);
            expect(sut).toEqual([1, 6, 6, 4]);
        });

        it('should emit an appropriate action', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            setupActionSubscription(sut);
            sut.fill(1, 2, 3);

            const action = getLastAction(a.ArrayFillAction);
            expect(action.type).toBe(a.ArrayActions.fill);
            expect(action.array).toBe(sut);
            expect(action.value).toBe(1);
            expect(action.start).toBe(2);
            expect(action.end).toBe(3);
        });
    });

    describe('pop function', () => {
        it('should behave the same as the native function of the same name', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            sut.pop();
            expect(sut).toEqual([1, 2, 3]);
        });

        it('should emit an appropriate action', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            setupActionSubscription(sut);
            sut.pop();

            const action = getLastAction(a.ArrayPopAction);
            expect(action.type).toBe(a.ArrayActions.pop);
            expect(action.array).toBe(sut);
        });
    });

    describe('push function', () => {
        it('should behave the same as the native function of the same name', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            sut.push(5, 6);
            expect(sut).toEqual([1, 2, 3, 4, 5, 6]);
        });

        it('should emit an appropriate action', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            setupActionSubscription(sut);
            sut.push(5, 6);

            const action = getLastAction(a.ArrayPushAction);
            expect(action.type).toBe(a.ArrayActions.push);
            expect(action.array).toBe(sut);
            expect(action.elements).toEqual([5, 6]);
        });
    });

    describe('reverse function', () => {
        it('should behave the same as the native function of the same name', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            sut.reverse();
            expect(sut).toEqual([4, 3, 2, 1]);
        });

        it('should emit an appropriate action', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            setupActionSubscription(sut);
            sut.reverse();

            const action = getLastAction(a.ArrayReverseAction);
            expect(action.type).toBe(a.ArrayActions.reverse);
            expect(action.array).toBe(sut);
        });
    });

    describe('shift function', () => {
        it('should behave the same as the native function of the same name', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            sut.shift();
            expect(sut).toEqual([2, 3, 4]);
        });

        it('should emit an appropriate action', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            setupActionSubscription(sut);
            sut.shift();

            const action = getLastAction(a.ArrayShiftAction);
            expect(action.type).toBe(a.ArrayActions.shift);
            expect(action.array).toBe(sut);
        });
    });

    describe('sort function', () => {
        function reverseSorter(item) { return 100 - item; };

        it('should behave the same as the native function of the same name', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            sut.sort(reverseSorter);
            expect(sut).toEqual([4, 3, 2, 1]);
        });

        it('should emit an appropriate action', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            setupActionSubscription(sut);
            sut.sort(reverseSorter);

            const action = getLastAction(a.ArraySortAction);
            expect(action.type).toBe(a.ArrayActions.sort);
            expect(action.compareFunction).toBe(reverseSorter);
            expect(action.array).toBe(sut);
        });
    });

    describe('splice function', () => {
        it('should behave the same as the native function of the same name', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            sut.splice(1, 1, 6, 7);
            expect(sut).toEqual([1, 6, 7, 3, 4]);
        });

        it('should emit an appropriate action', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            setupActionSubscription(sut);
            sut.splice(1, 2, 3, 4);

            const action = getLastAction(a.ArraySpliceAction);
            expect(action.type).toBe(a.ArrayActions.splice);
            expect(action.array).toBe(sut);
            expect(action.start).toBe(1);
            expect(action.deleteCount).toBe(2);
            expect(action.items).toEqual([3, 4]);
        });
    });

    describe('unshift function', () => {
        it('should behave the same as the native function of the same name', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            sut.unshift(5, 6, 7);
            expect(sut).toEqual([5, 6, 7, 1, 2, 3, 4]);
        });

        it('should emit an appropriate action', () => {
            const sut = new ObservableArray<number>([1, 2, 3, 4]);
            setupActionSubscription(sut);
            sut.unshift(5, 6, 7);

            const action = getLastAction(a.ArrayUnshiftAction);
            expect(action.type).toBe(a.ArrayActions.unshift);
            expect(action.array).toBe(sut);
            expect(action.elements).toEqual([5, 6, 7]);
        });
    });

    describe('fromValues static function', () => {
        it('should create an observable array from the given values', () => {
            const sut = ObservableArray.fromValues(1, 2, 3, 4);
            expect(sut).toEqual([1, 2, 3, 4]);
        });
    });

    function setupActionSubscription<T : mixed>(sut : ObservableArray<T>) {
        sub = sut.actions.subscribe(action => lastAction = action);
    }

    function getLastAction<T : a.ArrayAction<number>>(expected : Class<T>) : T {
        if(!lastAction) throw new Error('Last action must not be null');

        if(lastAction instanceof expected)
            return lastAction;

        if(!(lastAction instanceof a.ArrayAction))
        {
            throw new Error(`Last action must be an action instance (likely a test error)
Actual: ${lastAction.toString()}`);
        }

        throw new Error(`Last action must be of the requested type
Requested:  ${expected.name}
Actual:     ${lastAction.constructor.name}`);
    }
});