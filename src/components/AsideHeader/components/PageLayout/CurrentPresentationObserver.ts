import {COMPOSITE_BAR_ITEM_ID_ATTRIBUTE} from '../CompositeBar/constants';

import {CURRENT_IDS_ATTRIBUTE, CURRENT_ROW_SELECTOR, SURFACE_SELECTOR} from './currentIndicatorDom';
import {type CurrentIdentitySnapshot, captureCurrentIdentity} from './currentIndicatorModel';

type IdentityChange = (
    identities: CurrentIdentitySnapshot,
    changedSurfaces: Set<HTMLElement>,
) => void;

const BINDING_SELECTOR = `${CURRENT_ROW_SELECTOR}, ${SURFACE_SELECTOR}, [data-gn-aside-current-indicator-layer], [data-gn-aside-current-indicator]`;

/** Subscription and metadata diff only; the coordinator owns observation lifetime. */
export class CurrentPresentationObserver {
    private observer?: MutationObserver;
    private panel?: HTMLElement;
    private onChange: IdentityChange;
    private identities: CurrentIdentitySnapshot = new Map();

    constructor(onChange: IdentityChange) {
        this.onChange = onChange;
    }

    observe(panel: HTMLElement, initialIdentities: CurrentIdentitySnapshot): void {
        if (this.panel === panel) return;
        this.disconnect();
        this.panel = panel;
        this.identities = initialIdentities;
        const parent = panel.parentElement;
        const observer = new MutationObserver((records) => {
            if (this.observer !== observer) return;
            const bindingChanged = records.some((record) => {
                if (record.type !== 'childList') return false;
                const nodes = [
                    ...Array.from(record.addedNodes),
                    ...Array.from(record.removedNodes),
                ];
                if (record.target === parent) return nodes.includes(panel);
                return nodes.some(
                    (node) =>
                        node instanceof HTMLElement &&
                        (node.matches(BINDING_SELECTOR) ||
                            Boolean(node.querySelector(BINDING_SELECTOR))),
                );
            });
            // The immediate parent's other children belong to page content.
            if (!bindingChanged && !records.some((record) => record.type === 'attributes')) return;
            this.check(panel, captureCurrentIdentity(panel), bindingChanged);
        });
        this.observer = observer;
        observer.observe(panel, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: [
                CURRENT_IDS_ATTRIBUTE,
                COMPOSITE_BAR_ITEM_ID_ATTRIBUTE,
                'data-gn-aside-part',
                'id',
            ],
        });
        if (parent) observer.observe(parent, {childList: true});
    }

    // The coordinator can reconcile a synchronous React commit before mutation
    // delivery, reusing the same identities for its subsequent moving snapshot.
    check(panel: HTMLElement, identities: CurrentIdentitySnapshot, bindingChanged = false): void {
        if (this.panel !== panel) return;
        const changedSurfaces = new Set<HTMLElement>();
        this.identities.forEach((previous, row) => {
            const current = identities.get(row);
            const ids = new Set(current?.currentIds);
            if (
                !current ||
                current.key !== previous.key ||
                current.surface !== previous.surface ||
                ids.size !== new Set(previous.currentIds).size ||
                previous.currentIds.some((id) => !ids.has(id))
            ) {
                changedSurfaces.add(previous.surface);
                if (current) changedSurfaces.add(current.surface);
            }
        });
        identities.forEach((current, row) => {
            if (!this.identities.has(row)) changedSurfaces.add(current.surface);
        });
        this.identities = identities;
        if (changedSurfaces.size || bindingChanged) this.onChange(identities, changedSurfaces);
    }

    disconnect(): void {
        this.panel = undefined;
        this.identities = new Map();
        this.observer?.disconnect();
        this.observer = undefined;
    }
}
