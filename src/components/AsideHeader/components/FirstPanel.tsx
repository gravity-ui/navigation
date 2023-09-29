import React, {useRef} from 'react';
import {CompositeBar} from '../../CompositeBar/CompositeBar';
import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import {b} from '../utils';
import {useVisibleMenuItems} from '../../AllPagesPanel';

import i18n from '../i18n';
import {Header} from './Header';
import {CollapseButton} from './CollapseButton';
import {Panels} from './Panels';

export const FirstPanel = () => {
    const {
        size,
        onItemClick,
        headerDecoration,
        multipleTooltip,
        menuMoreTitle,
        renderFooter,
        compact,
    } = useAsideHeaderInnerContext();
    const visibleMenuItems = useVisibleMenuItems();

    const asideRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <div className={b('aside')} style={{width: size}}>
                <div className={b('aside-popup-anchor')} ref={asideRef} />
                <div className={b('aside-content', {['with-decoration']: headerDecoration})}>
                    <Header />
                    {visibleMenuItems?.length ? (
                        <CompositeBar
                            type="menu"
                            items={visibleMenuItems}
                            menuMoreTitle={menuMoreTitle ?? i18n('label_more')}
                            onItemClick={onItemClick}
                            multipleTooltip={multipleTooltip}
                        />
                    ) : (
                        <div className={b('menu-items')} />
                    )}
                    <div className={b('footer')}>
                        {renderFooter?.({
                            size,
                            compact: Boolean(compact),
                            asideRef,
                        })}
                    </div>
                    <CollapseButton />
                </div>
            </div>
            <Panels />
        </>
    );
};
