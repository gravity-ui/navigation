import React from 'react';

interface Registration {
    register: (element: HTMLElement, id: symbol) => () => void;
    selectedId: symbol | undefined;
    compact: boolean;
}

interface Selection {
    element: HTMLElement;
    id: symbol;
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
    // Fixed-position descendants can leave this offset chain. Never treat their
    // partial viewport-relative offset as a position inside the aside.
    return current === panel ? top : null;
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
    const rows = React.useRef(new Map<HTMLElement, symbol>());
    const reconcileRef = React.useRef<() => void>();
    const [selection, setSelection] = React.useState<Selection | null>(null);
    const selectionRef = React.useRef<Selection | null>(null);
    const register = React.useCallback((element: HTMLElement, id: symbol) => {
        rows.current.set(element, id);
        reconcileRef.current?.();
        return () => {
            rows.current.delete(element);
            reconcileRef.current?.();
        };
    }, []);

    React.useLayoutEffect(() => {
        if (!enabled || !panelRef.current || !footerRef.current) {
            setSelection(null);
            return undefined;
        }
        const panel = panelRef.current;
        const footer = footerRef.current;
        const heights = new WeakMap<Element, number>();
        const resize =
            typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(handleResize);
        const measure = () => {
            const row = selectionRef.current?.element ?? fallbackRef.current;
            const slot = slotRef.current;
            if (!row || !slot) return;
            const rowTop = layoutTop(row, panel);
            if (rowTop === null) {
                slot.style.removeProperty('top');
                slot.style.removeProperty('bottom');
                return;
            }
            const top = rowTop + (row.offsetHeight - slot.offsetHeight) / 2;
            slot.style.top = `${top}px`;
            slot.style.bottom = 'auto';
        };
        function reconcile() {
            let last: HTMLElement | null = null;
            rows.current.forEach((_id, row) => {
                if (!footer.contains(row) || !visible(row, footer)) return;
                // DOM order can change without registration order changing.
                // eslint-disable-next-line no-bitwise
                if (!last || last.compareDocumentPosition(row) & Node.DOCUMENT_POSITION_FOLLOWING)
                    last = row;
            });
            const id = last ? rows.current.get(last) : undefined;
            if (
                last !== (selectionRef.current?.element ?? null) ||
                id !== selectionRef.current?.id
            ) {
                if (selectionRef.current) {
                    resize?.unobserve(selectionRef.current.element);
                    selectionRef.current.element.removeAttribute('data-gn-collapse-anchor');
                }
                // Changing the anchor invalidates only the slot's Y effect.
                slotRef.current?.getAnimations?.().forEach((animation) => {
                    if (!('transitionProperty' in animation)) animation.cancel();
                });
                const next = last && id ? {element: last, id} : null;
                selectionRef.current = next;
                if (last) {
                    (last as HTMLElement).setAttribute('data-gn-collapse-anchor', '');
                    resize?.observe(last);
                }
                setSelection(next);
            }
            measure();
        }
        function handleResize(entries: ResizeObserverEntry[]) {
            let heightChanged = false;
            entries.forEach(({target, contentRect}) => {
                if (heights.get(target) !== contentRect.height) heightChanged = true;
                heights.set(target, contentRect.height);
            });
            // The flex layout tracks horizontal movement. Only a height change
            // requires vertical measurement during the compact width transition.
            if (entries.length && !heightChanged && panel.hasAttribute('data-gn-aside-animating'))
                return;
            // Idle resizes may change CSS visibility without a DOM mutation.
            reconcile();
        }
        resize?.observe(panel);
        resize?.observe(footer);
        reconcileRef.current = reconcile;
        reconcile();
        const finishWidthTransition = (event: TransitionEvent) => {
            if (event.target === panel && event.propertyName === 'width') reconcile();
        };
        // Recheck CSS-only visibility after the width-only notifications skipped
        // above, even when the last resize precedes the coordinator's cleanup.
        panel.addEventListener('transitionend', finishWidthTransition);
        panel.addEventListener('transitioncancel', finishWidthTransition);
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
            panel.removeEventListener('transitionend', finishWidthTransition);
            panel.removeEventListener('transitioncancel', finishWidthTransition);
            selectionRef.current?.element.removeAttribute('data-gn-collapse-anchor');
            selectionRef.current = null;
        };
    }, [enabled]);
    React.useLayoutEffect(() => {
        reconcileRef.current?.();
    });
    const context = React.useMemo(
        () => (enabled ? {register, selectedId: selection?.id, compact} : undefined),
        [enabled, register, selection, compact],
    );
    return {
        panelRef,
        footerRef,
        slotRef,
        fallbackRef,
        selected: selection?.element ?? null,
        context,
    };
}
