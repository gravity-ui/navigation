import React, {useRef} from 'react';

import {setRef} from '@gravity-ui/uikit';

import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import i18n from '../i18n';
import {b} from '../utils';

import {useVisibleMenuItems} from './AllPagesPanel';
import {CollapseButton} from './CollapseButton/CollapseButton';
import {CompositeBar} from './CompositeBar';
import {Header} from './Header';
import {Panels} from './Panels';

export const FirstPanel = React.forwardRef<HTMLDivElement>((_props, ref) => {
    const {
        size,
        onItemClick,
        headerDecoration,
        multipleTooltip,
        menuMoreTitle,
        onMenuMoreClick,
        renderFooter,
        compact,
        customBackground,
        customBackgroundClassName,
        className,
        hideCollapseButton,
        qa,
    } = useAsideHeaderInnerContext();
    const visibleMenuItems = useVisibleMenuItems();

    const asideRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setRef<HTMLDivElement>(ref, asideRef.current);
    }, [ref]);

    return (
        <React.Fragment>
            <div className={b('aside', className)} style={{width: size}} data-qa={qa}>
                <div className={b('aside-popup-anchor')} ref={asideRef} />
                {customBackground && (
                    <div className={b('aside-custom-background', customBackgroundClassName)}>
                        {customBackground}
                    </div>
                )}

                <div className={b('aside-content', {['with-decoration']: headerDecoration})}>
                    <Header />
                    {visibleMenuItems?.length ? (
                        <CompositeBar
                            type="menu"
                            compact={compact}
                            items={visibleMenuItems}
                            menuMoreTitle={menuMoreTitle ?? i18n('label_more')}
                            onItemClick={onItemClick}
                            onMoreClick={onMenuMoreClick}
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
                    {!hideCollapseButton && <CollapseButton />}
                </div>
            </div>
            <Panels />
        </React.Fragment>
    );
});

FirstPanel.displayName = 'FirstPanel';
