import * as React from 'react';

import {ASIDE_HEADER_COMPACT_WIDTH, ASIDE_HEADER_EXPANDED_WIDTH} from '../constants';
import {createBlock} from '../utils/cn';

import {LayoutMode, LayoutProvider} from './LayoutContext';
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

    const contextValue = React.useMemo(
        () => ({compact, size, layout, setCompact}),
        [compact, size, layout, setCompact],
    );

    return (
        <LayoutProvider value={contextValue}>
            <div
                ref={ref}
                className={b({compact}, className)}
                style={{['--gn-aside-header-size' as string]: `${size}px`}}
            >
                {layout === 'slots' ? <SlotsLayout>{children}</SlotsLayout> : children}
            </div>
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
                        <div className={b('menu')}>{slots.menu}</div>
                        <div className={b('footer')}>{slots.footer}</div>
                    </div>
                </aside>
                <div className={b('content')}>{slots.content}</div>
                {slots.panels}
            </div>
        </React.Fragment>
    );
}
