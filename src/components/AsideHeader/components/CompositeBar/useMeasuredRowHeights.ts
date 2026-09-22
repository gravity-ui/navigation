import React from 'react';

import {COMPOSITE_BAR_ITEM_ID_ATTRIBUTE} from './constants';

const useLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

/**
 * Only the More algorithm needs measurements: CSS owns the row geometry. Keep
 * measurements for overflowed rows until content, width, density or fonts change.
 * Unknown rows start at their minimum height, so a candidate is rendered and
 * measured before deciding it cannot fit. No duplicate/hidden React trees.
 *
 * @param scope Identity of the content and layout whose measurements can be reused.
 * @param enabled Whether expanded More overflow needs measurements.
 * @returns Container ref and measured heights for this layout.
 */
export function useMeasuredRowHeights(scope: object, enabled: boolean) {
    const ref = React.useRef<HTMLDivElement>(null);
    const [cache, setCache] = React.useState<{
        scope: object;
        width: number;
        heights: ReadonlyMap<string, number>;
    }>({scope, width: 0, heights: new Map()});

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
            const width = container.getBoundingClientRect().width;
            if (!width) return;
            const currentRows = new Set<HTMLElement>();
            const measurements = Array.from(
                container.querySelectorAll<HTMLElement>(`[${COMPOSITE_BAR_ITEM_ID_ATTRIBUTE}]`),
            ).flatMap((item) => {
                const row = item.closest<HTMLElement>('.g-list__item');
                const id = item.getAttribute(COMPOSITE_BAR_ITEM_ID_ATTRIBUTE);
                if (!row || !id) return [];
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
                const invalid = reset || previous.scope !== scope || previous.width !== width;
                const heights = new Map(invalid ? [] : previous.heights);
                let changed = invalid;
                for (const {id, height} of measurements) {
                    if (height > 0 && heights.get(id) !== height) {
                        heights.set(id, height);
                        changed = true;
                    }
                }
                return changed ? {scope, width, heights} : previous;
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

        measure();
        observer?.observe(container);
        const mutations = new MutationObserver(scheduleMeasure);
        mutations.observe(container, {childList: true, characterData: true, subtree: true});

        // A font change can shrink a row currently in More, where there is no
        // sidebar DOM to observe. Forget those cached heights as well.
        const onFontsChanged = () => measure(true);
        document.fonts?.addEventListener('loadingdone', onFontsChanged);
        return () => {
            if (frame !== undefined) cancelAnimationFrame(frame);
            observer?.disconnect();
            mutations.disconnect();
            document.fonts?.removeEventListener('loadingdone', onFontsChanged);
        };
    }, [enabled, scope]);

    return {ref, heights: cache.scope === scope ? cache.heights : undefined};
}
