import * as React from 'react';

import {ASIDE_HEADER_COMPACT_WIDTH, ASIDE_HEADER_EXPANDED_WIDTH} from '../constants';
import {createBlock} from '../utils/cn';

import {LayoutMode, LayoutProvider} from './LayoutContext';
import {MatchStrategy, NavigationProvider} from './NavigationContext';
import {collectSlots} from './internal/slots';

import styles from './AsideHeaderNext.module.scss';

const b = createBlock('aside-header-next', styles);

export interface RootProps {
    children?: React.ReactNode;
    className?: string;
    /** `slots` (default): strict layout, order in JSX is irrelevant. `manual`: free composition. */
    layout?: LayoutMode;
    compact?: boolean;
    defaultCompact?: boolean;
    onCompactChange?: (compact: boolean) => void;
    /** Optional sugar: derives `current` for rows that declare an `href`. */
    currentPath?: string;
    matchStrategy?: MatchStrategy;
    ref?: React.Ref<HTMLDivElement>;
}

export function Root(props: RootProps) {
    const {
        children,
        className,
        layout = 'slots',
        compact: controlledCompact,
        defaultCompact = false,
        onCompactChange,
        currentPath,
        matchStrategy = 'prefix',
        ref,
    } = props;

    const [uncontrolledCompact, setUncontrolledCompact] = React.useState(defaultCompact);
    const compact = controlledCompact ?? uncontrolledCompact;

    const setCompact = React.useCallback(
        (next: boolean) => {
            if (controlledCompact === undefined) {
                setUncontrolledCompact(next);
            }
            onCompactChange?.(next);
        },
        [controlledCompact, onCompactChange],
    );

    const size = compact ? ASIDE_HEADER_COMPACT_WIDTH : ASIDE_HEADER_EXPANDED_WIDTH;

    // Portal target for `Panel.Content`, so a panel can be declared next to its
    // trigger inside a list without disturbing the layout.
    const [panelContainer, setPanelContainer] = React.useState<HTMLElement | null>(null);

    const contextValue = React.useMemo(
        () => ({compact, size, layout, setCompact, panelContainer}),
        [compact, size, layout, setCompact, panelContainer],
    );

    const navigationValue = React.useMemo(
        () => ({currentPath, matchStrategy}),
        [currentPath, matchStrategy],
    );

    return (
        <LayoutProvider value={contextValue}>
            <NavigationProvider value={navigationValue}>
                <div
                    ref={ref}
                    className={b({compact}, className)}
                    style={{['--gn-aside-header-size' as string]: `${size}px`}}
                >
                    {layout === 'slots' ? <SlotsLayout>{children}</SlotsLayout> : children}
                    <div ref={setPanelContainer} className={b('panels')} />
                </div>
            </NavigationProvider>
        </LayoutProvider>
    );
}

function SlotsLayout({children}: {children: React.ReactNode}) {
    const {slots, unknown} = collectSlots(children);

    if (process.env.NODE_ENV !== 'production' && unknown.length > 0) {
        // eslint-disable-next-line no-console
        console.error(
            '[AsideHeaderNext] In `slots` layout, only tagged AsideHeaderNext.* parts are allowed ' +
                'as direct children. Unrecognized children were ignored. Use layout="manual" for free composition.',
        );
    }

    return (
        <React.Fragment>
            {slots.alert}
            <div className={b('pane-container')}>
                <aside className={b('aside')}>
                    {slots.background.length > 0 && (
                        <div className={b('background')}>{slots.background}</div>
                    )}
                    <div className={b('aside-content')}>
                        <div className={b('header')}>{slots.header}</div>
                        {slots.menu}
                        <div className={b('footer')}>{slots.footer}</div>
                    </div>
                </aside>
                <div className={b('content')}>{slots.content}</div>
                {slots.panels}
            </div>
        </React.Fragment>
    );
}
