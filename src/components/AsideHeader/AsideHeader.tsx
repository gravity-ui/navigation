import React from 'react';

import {PageLayout} from './components/PageLayout/PageLayout';
import {PageLayoutAside} from './components/PageLayout/PageLayoutAside';
import {AsideHeaderProps} from './types';

export const AsideHeader = React.forwardRef<HTMLDivElement, AsideHeaderProps>(
    ({pinned, className, topAlert, isCompactMode, ...props}, ref) => {
        return (
            <PageLayout
                pinned={pinned}
                onChangePinned={props.onChangePinned}
                className={className}
                topAlert={topAlert}
                isCompactMode={isCompactMode}
            >
                <PageLayoutAside ref={ref} {...props} isCompactMode={isCompactMode} />
                <PageLayout.Content renderContent={props.renderContent} />
            </PageLayout>
        );
    },
);

AsideHeader.displayName = 'AsideHeader';
