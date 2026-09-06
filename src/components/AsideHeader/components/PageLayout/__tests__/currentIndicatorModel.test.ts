/** @jest-environment jsdom */
import {
    type CurrentPresentation,
    captureCurrentPresentation,
    getCurrentRowKey,
    matchCurrentPresentations,
} from '../currentIndicatorModel';

function presentation(rowId: string, currentIds = ['weekly'], section = 'menu') {
    return {
        key: JSON.stringify([section, rowId]),
        section,
        rowId,
        currentIds,
        row: document.createElement('div'),
        surface: document.createElement('div'),
        rect: new DOMRect(10, 20, 100, 40),
        color: 'rgb(0, 0, 255)',
        radius: '8px',
    } satisfies CurrentPresentation;
}

function snapshot(...rows: CurrentPresentation[]) {
    return new Map(rows.map((row, index) => [String(index), row]));
}

describe('current presentation matching', () => {
    it('transfers a unique logical current between different rows', () => {
        const from = presentation('weekly');
        const to = presentation('analytics');
        const matches = matchCurrentPresentations(snapshot(from), snapshot(to));
        expect(matches).toHaveLength(1);
        expect(matches[0].from).toBe(from);
        expect(matches[0].to).toBe(to);
    });

    it('retains native morph for the same representative', () => {
        expect(
            matchCurrentPresentations(
                snapshot(presentation('weekly')),
                snapshot(presentation('weekly')),
            ),
        ).toEqual([]);
    });

    it('does not connect unrelated currents or sections', () => {
        expect(
            matchCurrentPresentations(
                snapshot(presentation('weekly')),
                snapshot(presentation('more', ['home'])),
            ),
        ).toEqual([]);
        expect(
            matchCurrentPresentations(
                snapshot(presentation('weekly')),
                snapshot(presentation('more', ['weekly'], 'quick')),
            ),
        ).toEqual([]);
    });

    it('preserves intentional duplication across sections', () => {
        const before = snapshot(
            presentation('weekly'),
            presentation('weekly', ['weekly'], 'quick'),
        );
        const after = snapshot(
            presentation('analytics'),
            presentation('more', ['weekly'], 'quick'),
        );
        expect(matchCurrentPresentations(before, after)).toHaveLength(2);
    });

    it('rejects ambiguous representatives and multi-current aggregates', () => {
        expect(
            matchCurrentPresentations(
                snapshot(presentation('weekly'), presentation('copy')),
                snapshot(presentation('analytics')),
            ),
        ).toEqual([]);
        expect(
            matchCurrentPresentations(
                snapshot(presentation('weekly')),
                snapshot(presentation('analytics'), presentation('copy')),
            ),
        ).toEqual([]);
        expect(
            matchCurrentPresentations(
                snapshot(presentation('weekly'), presentation('home', ['home'])),
                snapshot(presentation('more', ['weekly', 'home'])),
            ),
        ).toEqual([]);
    });

    it('rejects empty geometry', () => {
        const from = {...presentation('weekly'), rect: new DOMRect()};
        expect(
            matchCurrentPresentations(snapshot(from), snapshot(presentation('analytics'))),
        ).toEqual([]);
    });

    it.each(['menu-items', 'quick-access'])(
        'matches item and More through different UIKit wrapper IDs in the %s bar',
        (section) => {
            const panel = document.createElement('div');
            const sectionId = `gravity-ui/navigation-${section}-composite-bar`;
            const root = document.createElement('div');
            root.id = sectionId;
            panel.append(root);
            const setRow = (rowId: string, index: number) => {
                root.innerHTML = `<div id="${sectionId}-item-${index}"><div data-gn-composite-bar-item-id="${rowId}" data-gn-aside-current-ids='["more-26"]'><span data-gn-aside-part="surface"></span></div></div>`;
                const surface = root.querySelector<HTMLElement>('[data-gn-aside-part]');
                if (!surface) throw new Error('Missing selection surface');
                surface.getBoundingClientRect = () => new DOMRect(10, 20, 100, 40);
            };
            setRow('more-26', 26);
            const before = captureCurrentPresentation(panel);
            setRow('collapse-item-id', 17);
            const after = captureCurrentPresentation(panel);
            const matches = matchCurrentPresentations(before, after);
            expect(matches).toHaveLength(1);
            expect(matches[0].from.section).toBe(sectionId);
            expect(matches[0].to.section).toBe(sectionId);
            expect(getCurrentRowKey(matches[0].to.row)).toBe(
                JSON.stringify([sectionId, 'collapse-item-id']),
            );
        },
    );

    it('captures semantic metadata from live rows, excluding decorative copies', () => {
        const panel = document.createElement('div');
        panel.innerHTML = `<div id="gravity-ui/navigation-menu-items-composite-bar"><div data-gn-composite-bar-item-id="weekly" data-gn-aside-current-ids='["weekly"]'><span data-gn-aside-part="surface"></span></div></div>`;
        const surface = panel.querySelector<HTMLElement>('[data-gn-aside-part]');
        if (!surface || !panel.firstElementChild) throw new Error('Missing selection fixture');
        surface.getBoundingClientRect = () => new DOMRect(10, 20, 100, 40);
        const ghost = document.createElement('div');
        ghost.setAttribute('data-gn-aside-transition-overlay', '');
        ghost.append(panel.firstElementChild.cloneNode(true));
        panel.append(ghost);
        const rows = [...captureCurrentPresentation(panel).values()];
        expect(rows).toHaveLength(1);
        expect(rows[0]).toMatchObject({
            section: 'gravity-ui/navigation-menu-items-composite-bar',
            rowId: 'weekly',
            currentIds: ['weekly'],
            surface,
        });
    });
});
