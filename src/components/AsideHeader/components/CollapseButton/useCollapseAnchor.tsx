import React from 'react';

interface Registration {
    register: (element: HTMLElement) => () => void;
    selected: HTMLElement | null;
    compact: boolean;
}

export const CollapseAnchorContext = React.createContext<Registration | undefined>(undefined);

// offset geometry deliberately excludes the coordinator's in-flight transforms.
function layoutTop(element: HTMLElement, panel: HTMLElement) {
    let top = 0;
    let current: HTMLElement | null = element;
    while (current && current !== panel) {
        top += current.offsetTop;
        current = current.offsetParent as HTMLElement | null;
    }
    return top;
}

function visible(element: HTMLElement, footer: HTMLElement) {
    for (let current: HTMLElement | null = element; current; current = current.parentElement) {
        const style = getComputedStyle(current);
        if (
            current.hidden ||
            style.display === 'none' ||
            style.visibility === 'hidden' ||
            style.visibility === 'collapse'
        )
            return false;
        if (current === footer) return true;
    }
    return false;
}

export function useCollapseAnchor(enabled: boolean, compact: boolean) {
    const panelRef = React.useRef<HTMLDivElement>(null);
    const footerRef = React.useRef<HTMLDivElement>(null);
    const slotRef = React.useRef<HTMLDivElement>(null);
    const fallbackRef = React.useRef<HTMLDivElement>(null);
    const rows = React.useRef(new Set<HTMLElement>());
    const reconcileRef = React.useRef<() => void>();
    const [selected, setSelected] = React.useState<HTMLElement | null>(null);
    const selectedRef = React.useRef<HTMLElement | null>(null);
    const register = React.useCallback((element: HTMLElement) => {
        rows.current.add(element);
        reconcileRef.current?.();
        return () => {
            rows.current.delete(element);
            reconcileRef.current?.();
        };
    }, []);

    React.useLayoutEffect(() => {
        const panel = panelRef.current;
        const footer = footerRef.current;
        if (!enabled || !panel || !footer) {
            setSelected(null);
            return undefined;
        }
        const measure = () => {
            const row = selectedRef.current ?? fallbackRef.current;
            const slot = slotRef.current;
            if (!row || !slot) return;
            const top = layoutTop(row, panel) + (row.offsetHeight - slot.offsetHeight) / 2;
            slot.style.top = `${top}px`;
            slot.style.bottom = 'auto';
        };
        const reconcile = () => {
            let last: HTMLElement | null = null;
            rows.current.forEach((row) => {
                if (!footer.contains(row) || !visible(row, footer)) return;
                // DOM order can change without registration order changing.
                // eslint-disable-next-line no-bitwise
                if (!last || last.compareDocumentPosition(row) & Node.DOCUMENT_POSITION_FOLLOWING)
                    last = row;
            });
            if (last !== selectedRef.current) {
                if (selectedRef.current) {
                    resize?.unobserve(selectedRef.current);
                    selectedRef.current.removeAttribute('data-gn-collapse-anchor');
                }
                // Changing the anchor invalidates only the slot's Y effect.
                slotRef.current?.getAnimations?.().forEach((animation) => {
                    if (!('transitionProperty' in animation)) animation.cancel();
                });
                selectedRef.current = last;
                if (last) {
                    (last as HTMLElement).setAttribute('data-gn-collapse-anchor', '');
                    resize?.observe(last);
                }
                setSelected(last);
            }
            measure();
        };
        // Media-query visibility can change without any footer DOM mutation.
        // Reconcile on resize as well as measuring the selected row's geometry.
        const resize =
            typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(reconcile);
        resize?.observe(panel);
        resize?.observe(footer);
        reconcileRef.current = reconcile;
        reconcile();
        const mutations = new MutationObserver(reconcile);
        mutations.observe(footer, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['hidden', 'style', 'class'],
        });
        return () => {
            reconcileRef.current = undefined;
            resize?.disconnect();
            mutations.disconnect();
            selectedRef.current?.removeAttribute('data-gn-collapse-anchor');
            selectedRef.current = null;
        };
    }, [enabled]);
    React.useLayoutEffect(() => {
        reconcileRef.current?.();
    });
    const context = React.useMemo(
        () => (enabled ? {register, selected, compact} : undefined),
        [enabled, register, selected, compact],
    );
    return {panelRef, footerRef, slotRef, fallbackRef, selected, context};
}
