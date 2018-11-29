//@flow
import { ObservableClearableWeakMapWrapper } from './ObservableClearableWeakMapWrapper';
import { WeakMapAction, WeakMapSetAction, WeakMapClearAction, WeakMapReplaceContentsAction } from './WeakMapAction';

describe('The observable/clearable weak map wrapper', () => {
    const
        keyOne = { key: 'foo' },
        keyTwo = { key: 'bar' };

    it('should raise a set event when an item is set', () => {
        const sut = new ObservableClearableWeakMapWrapper<{key:string},number>();
        let event : WeakMapAction<{key:string},number>;
        const sub = sut.actions.subscribe(ev => event = ev);
        sut.set(keyOne, 2);
        expect(event instanceof WeakMapSetAction).toBe(true);
        sub.unsubscribe();
    });

    it('should raise a clear event when it is cleared', () => {
        const sut = new ObservableClearableWeakMapWrapper<{key:string},number>();
        let event : WeakMapAction<{key:string},number>;
        const sub = sut.actions.subscribe(ev => event = ev);
        sut.set(keyOne, 2);
        sut.clear();
        expect(event instanceof WeakMapClearAction).toBe(true);
        sub.unsubscribe();
    });

    it('should raise a replace event when it is replaced', () => {
        const sut = new ObservableClearableWeakMapWrapper<{key:string},number>();
        let event : WeakMapAction<{key:string},number>;
        const sub = sut.actions.subscribe(ev => event = ev);
        sut.set(keyOne, 2);
        sut.replaceContents([[keyTwo, 5]]);
        expect(event instanceof WeakMapReplaceContentsAction).toBe(true);
        sub.unsubscribe();
    });

    it('should clear the contents when it is cleared', () => {
        const sut = new ObservableClearableWeakMapWrapper<{key:string},number>();
        sut.set(keyOne, 2);
        sut.clear();
        expect(sut.has(keyOne)).toBe(false);
    });

    it('should replace the contents when it is replaced', () => {
        const sut = new ObservableClearableWeakMapWrapper<{key:string},number>();
        sut.set(keyOne, 2);
        sut.replaceContents([[keyTwo, 5]]);
        expect(sut.has(keyOne)).toBe(false);
        expect(sut.has(keyTwo)).toBe(true);
    });
});
