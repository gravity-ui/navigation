import React from 'react';

import {AsideHeaderProps} from './types';
import {PageLayout} from './components/PageLayout/PageLayout';
import {PageLayoutAside} from './components/PageLayout/PageLayoutAside';
import {useAsideHeaderTopPanel} from './useAsideHeaderTopPanel';

/**
 * Simply usage of AsideHeader:
 * @example
 * <AsideHeader renderContent={renderContent} {...props} />
 *
 * Advanced usage of AsideHeader:
 * @example
 * <PageLayout reverse >
 *  <PageLayout.Content>
 *      <Content />
 *  </PageLayout.Content>
 *
 *  <PageLayoutAside {...props} />
 * </PageLayout>
 */
export const AsideHeader = React.forwardRef<HTMLDivElement, AsideHeaderProps>(
    ({compact, className, topAlert, ...props}, ref) => {
        const {topRef, maxHeightWithTop, updateTopSize} = useAsideHeaderTopPanel({topAlert});

        return (
            <PageLayout
                compact={compact}
                className={className}
                topAlert={topAlert}
                topRef={topRef}
                updateTopSize={updateTopSize}
            >
                <PageLayoutAside ref={ref} {...props} maxHeight={maxHeightWithTop} />
                <PageLayout.Content
                    renderContent={props.renderContent}
                    maxHeight={maxHeightWithTop}
                />
            </PageLayout>
        );
    },
);
