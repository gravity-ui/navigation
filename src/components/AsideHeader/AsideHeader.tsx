import React from 'react';

import {AsideHeaderProps} from './types';
import {PageLayout} from './PageLayout/PageLayout';
import {PageLayoutAside} from './PageLayout/PageLayoutAside';

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
    ({compact, className, ...props}, ref) => {
        return (
            <PageLayout compact={compact} className={className}>
                <PageLayoutAside ref={ref} {...props} />
                <PageLayout.Content renderContent={props.renderContent} />
            </PageLayout>
        );
    },
);
