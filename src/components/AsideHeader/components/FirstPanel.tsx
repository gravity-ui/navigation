import React, {useRef} from 'react';

import {setRef} from '@gravity-ui/uikit';
import {CompositeBar} from '../../CompositeBar/CompositeBar';
import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import {b} from '../utils';
import {useVisibleMenuItems} from '../../AllPagesPanel';

import i18n from '../i18n';
import {Header} from './Header';
import {CollapseButton} from './CollapseButton';
import {Panels} from './Panels';

export const FirstPanel = React.forwardRef<HTMLDivElement>((_props, ref) => {
    const {
        size,
        onItemClick,
        headerDecoration,
        multipleTooltip,
        menuMoreTitle,
        renderFooter,
        compact,
        customBackground,
        customBackgroundClassName,
    } = useAsideHeaderInnerContext();
    const visibleMenuItems = useVisibleMenuItems();

    const asideRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setRef<HTMLDivElement>(ref, asideRef.current);
    }, [ref]);

    return (
        <>
            <div className={b('aside')} style={{width: size}}>
                <div className={b('aside-popup-anchor')} ref={asideRef} />

                <div className={b('aside-content', {['with-decoration']: headerDecoration})}>
                    {customBackground && (
                        <div className={b('aside-custom-background', customBackgroundClassName)}>
                            {customBackground}
                        </div>
                    )}
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
});
