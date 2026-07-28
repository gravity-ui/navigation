import * as React from 'react';

import {createBlock} from '../utils/cn';

import {Item, ItemProps} from './Item';
import {ItemDefaultsProvider} from './LayoutContext';
import {Composite} from './internal/composite/Composite';
import {withSlot} from './internal/slots';

import styles from './Menu.module.scss';

const b = createBlock('aside-header-next-menu', styles);

export interface MenuProps {
    children?: React.ReactNode;
    /** Data-driven alternative to composing `AsideHeaderNext.Item` children. */
    items?: ItemProps[];
    className?: string;
    ref?: React.Ref<HTMLDivElement>;
    'aria-label'?: string;
}

function MenuComponent(props: MenuProps) {
    const {children, items, className, ref, ...rest} = props;

    const content = items ? items.map((item) => <Item key={item.id} {...item} />) : children;

    const defaultActiveIndex = React.useMemo(() => {
        if (!items) {
            return 0;
        }
        const index = items.findIndex((item) => item.current);
        return index < 0 ? 0 : index;
    }, [items]);

    return (
        <ItemDefaultsProvider value={{place: 'menu'}}>
            <Composite
                ref={ref}
                orientation="vertical"
                defaultActiveIndex={defaultActiveIndex}
                className={b(null, className)}
                {...rest}
            >
                {content}
            </Composite>
        </ItemDefaultsProvider>
    );
}

export const Menu = withSlot(MenuComponent, 'menu');
