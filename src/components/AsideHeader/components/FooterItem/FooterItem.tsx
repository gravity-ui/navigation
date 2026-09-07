import React from 'react';

import {block, createBlock} from '../../../utils/cn';
import {useAsideHeaderContext} from '../../AsideHeaderContext';
import {getAsideHeaderDensityConfig} from '../../density';
import {AsideHeaderItem} from '../../types';
import {CollapseAnchorContext} from '../CollapseButton/useCollapseAnchor';
import {Item} from '../CompositeBar/Item/Item';

import styles from './FooterItem.module.scss';

const b = createBlock('footer-item', styles);
const bGlobal = block('footer-item');

export interface FooterItemProps extends AsideHeaderItem {
    /**
     * When `true`, the item is rendered with the same geometry as regular menu
     * items (40px row, 38px icon background) instead of the reduced footer size.
     */
    regularSize?: boolean;
}

export function FooterItem({regularSize, ...props}: FooterItemProps) {
    const anchor = React.useContext(CollapseAnchorContext);
    const register = anchor?.register;
    const row = React.useRef<HTMLElement | null>(null);
    const cleanup = React.useRef<() => void>();
    const rowRef = React.useCallback(
        (element: HTMLElement | null) => {
            cleanup.current?.();
            cleanup.current = undefined;
            row.current = element;
            if (element && register) cleanup.current = register(element);
        },
        [register],
    );
    const suppressTooltip = Boolean(anchor?.compact && anchor.selected === row.current);
    const {menuDensity} = useAsideHeaderContext();
    const {iconSize} = getAsideHeaderDensityConfig(menuDensity);

    return (
        <Item
            {...props}
            rowRef={rowRef}
            enableTooltip={suppressTooltip ? false : props.enableTooltip}
            iconSize={iconSize}
            className={`${b({compact: props.compact})} ${bGlobal({'regular-size': regularSize})}`}
        />
    );
}
