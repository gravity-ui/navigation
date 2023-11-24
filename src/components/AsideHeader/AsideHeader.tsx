import React from 'react';

import {AsideHeaderProps} from './types';
import {PageLayout} from './components/PageLayout/PageLayout';
import {PageLayoutAside} from './components/PageLayout/PageLayoutAside';

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
