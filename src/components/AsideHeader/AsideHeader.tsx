import React from 'react';

import {AsideHeaderProps} from './types';
import {PageLayout} from './components/PageLayout/PageLayout';
import {PageLayoutAside} from './components/PageLayout/PageLayoutAside';

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
        return (
            <PageLayout compact={compact} className={className} topAlert={topAlert}>
                <PageLayoutAside ref={ref} {...props} />
                <PageLayout.Content renderContent={props.renderContent} />
            </PageLayout>
        );
    },
);
