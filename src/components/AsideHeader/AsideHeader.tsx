import React from 'react';

import {PageLayout} from './components/PageLayout/PageLayout';
import {PageLayoutAside} from './components/PageLayout/PageLayoutAside';
import {useIsExpanded} from './hooks/useIsExpanded';
import {AsideHeaderProps} from './types';

export const AsideHeader = React.forwardRef<HTMLDivElement, AsideHeaderProps>(
    ({compact, className, topAlert, ...props}, ref) => {
        const [isExpanded, setIsExpanded] = useIsExpanded(compact, props.onChangeCompact);

        return (
            <PageLayout
                compact={compact}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                className={className}
                topAlert={topAlert}
            >
                <PageLayoutAside
                    ref={ref}
                    isExpanded={isExpanded}
                    setIsExpanded={setIsExpanded}
                    {...props}
                />
                <PageLayout.Content renderContent={props.renderContent} />
            </PageLayout>
        );
    },
);

AsideHeader.displayName = 'AsideHeader';
