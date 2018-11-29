//@flow
import { ObservableClearableWeakSetWrapper } from './ObservableClearableWeakSetWrapper';
import { WeakSetAction, WeakSetAddAction, WeakSetClearAction, WeakSetReplaceContentsAction } from './WeakSetAction';

describe('The observable/clearable weak set wrapper', () => {
    const
        keyOne = { key: 'foo' },
        keyTwo = { key: 'bar' };

    it('should raise an add event when an item is added', () => {
        const sut = new ObservableClearableWeakSetWrapper<{key:string}>();
        let event : WeakSetAction<{key:string}>;
        const sub = sut.actions.subscribe(ev => event = ev);
        sut.add(keyOne);
        expect(event instanceof WeakSetAddAction).toBe(true);
        sub.unsubscribe();
    });

    it('should raise a clear event when it is cleared', () => {
        const sut = new ObservableClearableWeakSetWrapper<{key:string}>();
        let event : WeakSetAction<{key:string}>;
        const sub = sut.actions.subscribe(ev => event = ev);
        sut.add(keyOne);
        sut.clear();
        expect(event instanceof WeakSetClearAction).toBe(true);
        sub.unsubscribe();
    });

    it('should raise a replace event when it is replaced', () => {
        const sut = new ObservableClearableWeakSetWrapper<{key:string}>();
        let event : WeakSetAction<{key:string}>;
        const sub = sut.actions.subscribe(ev => event = ev);
        sut.add(keyOne);
        sut.replaceContents([keyTwo]);
        expect(event instanceof WeakSetReplaceContentsAction).toBe(true);
        sub.unsubscribe();
    });

    it('should clear the contents when it is cleared', () => {
        const sut = new ObservableClearableWeakSetWrapper<{key:string}>();
        sut.add(keyOne);
        sut.clear();
        expect(sut.has(keyOne)).toBe(false);
    });

    it('should replace the contents when it is replaced', () => {
        const sut = new ObservableClearableWeakSetWrapper<{key:string}>();
        sut.add(keyOne);
        sut.replaceContents([keyTwo]);
        expect(sut.has(keyOne)).toBe(false);
        expect(sut.has(keyTwo)).toBe(true);
    });
});
