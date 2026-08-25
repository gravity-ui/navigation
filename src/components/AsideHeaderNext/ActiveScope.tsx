import * as React from 'react';

/**
 * Collects "I am active" reports from descendant rows so a `GroupItem` (or an
 * `ItemList`) can tell whether the active node lives inside it.
 *
 * External store rather than lifted state: one row reporting must not re-render
 * every sibling in the list.
 */
export class ActiveScopeStore {
    private active = new Set<string>();
    private listeners = new Set<() => void>();
    private snapshot = false;

    report = (id: string, isActive: boolean): void => {
        const had = this.active.has(id);
        if (isActive === had) {
            return;
        }
        if (isActive) {
            this.active.add(id);
        } else {
            this.active.delete(id);
        }
        const next = this.active.size > 0;
        if (next !== this.snapshot) {
            this.snapshot = next;
            this.listeners.forEach((listener) => listener());
        }
    };

    subscribe = (listener: () => void): (() => void) => {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    };

    getSnapshot = (): boolean => this.snapshot;
}

const ActiveScopeContext = React.createContext<ActiveScopeStore | null>(null);

export const ActiveScopeProvider = ActiveScopeContext.Provider;

/** Creates a scope and subscribes to "does it contain an active descendant". */
export function useActiveScope(): {store: ActiveScopeStore; hasActiveDescendant: boolean} {
    const [store] = React.useState(() => new ActiveScopeStore());
    const hasActiveDescendant = React.useSyncExternalStore(
        store.subscribe,
        store.getSnapshot,
        store.getSnapshot,
    );

    return {store, hasActiveDescendant};
}

/** Reports this row's activity to the nearest enclosing scope. */
export function useReportActive(id: string, isActive: boolean): void {
    const store = React.useContext(ActiveScopeContext);

    React.useEffect(() => {
        if (!store) {
            return undefined;
        }
        store.report(id, isActive);
        return () => store.report(id, false);
    }, [store, id, isActive]);
}
