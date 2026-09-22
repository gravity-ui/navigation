import React from 'react';

import isEqualWith from 'lodash/isEqualWith';

import {AsideHeaderItem} from '../../types';

import {COMPOSITE_BAR_ITEM_ID_ATTRIBUTE} from './constants';

const useLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

// Compare render inputs, not the identity of menu arrays or event callbacks.
// React's owner/debug metadata is unrelated to the element's rendered contents.
function equalContent(left: unknown, right: unknown): boolean {
    return isEqualWith(left, right, (a, b) => {
        if (React.isValidElement(a) && React.isValidElement(b)) {
            return a.type === b.type && a.key === b.key && equalContent(a.props, b.props);
        }
        return undefined;
    });
}

function getItemContent(item: AsideHeaderItem) {
    return {
        title: item.title,
        rightAdornment: item.rightAdornment,
        icon: item.icon,
        iconSize: item.iconSize,
        className: item.className,
        type: item.type,
        itemWrapper: item.itemWrapper,
        hasPopup: Boolean(item.compositeBarMenuPopupItems?.length),
    };
}

type RowContent = ReturnType<typeof getItemContent>;
type HeightCache = {
    scope: object;
    width: number;
    contents: ReadonlyMap<string, RowContent>;
    heights: ReadonlyMap<string, number>;
};

function retainHeights(cache: HeightCache, contents: ReadonlyMap<string, RowContent>) {
    const heights = new Map(cache.heights);
    for (const id of heights.keys()) {
        if (!contents.has(id) || !equalContent(cache.contents.get(id), contents.get(id))) {
            heights.delete(id);
        }
    }
    return heights;
}

/**
 * Only the More algorithm needs measurements: CSS owns the row geometry. Keep
 * measurements for overflowed rows until content, width, density or fonts change.
 * Unknown rows start at their minimum height, so a candidate is rendered and
 * measured before deciding it cannot fit. No duplicate/hidden React trees.
 *
 * @param items Rows that can appear in this bar, including More and hidden candidates.
 * @param scope Identity of the width, density and other shared layout settings.
 * @param enabled Whether expanded More overflow needs measurements.
 * @returns Container ref and measured heights for this layout.
 */
export function useMeasuredRowHeights(items: AsideHeaderItem[], scope: object, enabled: boolean) {
    const ref = React.useRef<HTMLDivElement>(null);
    const contents = React.useMemo(
        () => new Map(items.map((item) => [item.id, getItemContent(item)])),
        [items],
    );
    const [cache, setCache] = React.useState<HeightCache>({
        scope,
        width: 0,
        contents,
        heights: new Map(),
    });
    const inputsRef = React.useRef({scope, contents});
    const measureRef = React.useRef<() => void>();

    useLayoutEffect(() => {
        inputsRef.current = {scope, contents};
        measureRef.current?.();
    }, [scope, contents]);

    const heights = React.useMemo(() => {
        if (cache.scope !== scope) return undefined;
        const retained = retainHeights(cache, contents);
        return retained.size === cache.heights.size ? cache.heights : retained;
    }, [cache, scope, contents]);

    // Height updates never write a height back to the measured DOM. Observe
    // newly mounted candidates too, including AutoSizer's own size updates.
    useLayoutEffect(() => {
        const container = ref.current;
        if (!enabled || !container) return undefined;

        const observedRows = new Set<HTMLElement>();
        let frame: number | undefined;
        // Assigned after the callbacks it invokes; measure runs only after setup.
        // eslint-disable-next-line prefer-const
        let observer: ResizeObserver | undefined;

        const measure = (reset = false) => {
            const inputs = inputsRef.current;
            const width = container.getBoundingClientRect().width;
            if (!width) return;
            const currentRows = new Set<HTMLElement>();
            const measurements = Array.from(
                container.querySelectorAll<HTMLElement>(`[${COMPOSITE_BAR_ITEM_ID_ATTRIBUTE}]`),
            ).flatMap((item) => {
                const row = item.closest<HTMLElement>('.g-list__item');
                const id = item.getAttribute(COMPOSITE_BAR_ITEM_ID_ATTRIBUTE);
                if (!row || !id || !inputs.contents.has(id)) return [];
                currentRows.add(row);
                if (!observedRows.has(row)) observer?.observe(row);
                return [{id, height: row.getBoundingClientRect().height}];
            });
            observedRows.forEach((row) => {
                if (!currentRows.has(row)) observer?.unobserve(row);
            });
            observedRows.clear();
            currentRows.forEach((row) => observedRows.add(row));
            setCache((previous) => {
                const invalid =
                    reset || previous.scope !== inputs.scope || previous.width !== width;
                const nextHeights = invalid
                    ? new Map<string, number>()
                    : retainHeights(previous, inputs.contents);
                let changed = invalid || nextHeights.size !== previous.heights.size;
                for (const {id, height} of measurements) {
                    if (height > 0 && nextHeights.get(id) !== height) {
                        nextHeights.set(id, height);
                        changed = true;
                    }
                }
                return changed ? {...inputs, width, heights: nextHeights} : previous;
            });
        };

        const scheduleMeasure = () => {
            if (frame === undefined) {
                frame = requestAnimationFrame(() => {
                    frame = undefined;
                    measure();
                });
            }
        };
        observer =
            typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(scheduleMeasure);

        measureRef.current = measure;
        measure();
        observer?.observe(container);
        const mutations = new MutationObserver(scheduleMeasure);
        mutations.observe(container, {
            childList: true,
            characterData: !observer,
            subtree: true,
        });

        // A font change can shrink a row currently in More, where there is no
        // sidebar DOM to observe. Forget those cached heights as well.
        const onFontsChanged = () => measure(true);
        document.fonts?.addEventListener('loadingdone', onFontsChanged);
        return () => {
            measureRef.current = undefined;
            if (frame !== undefined) cancelAnimationFrame(frame);
            observer?.disconnect();
            mutations.disconnect();
            document.fonts?.removeEventListener('loadingdone', onFontsChanged);
        };
    }, [enabled]);

    return {ref, heights};
}
