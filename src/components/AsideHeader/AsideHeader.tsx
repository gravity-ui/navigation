import React from 'react';

import {PageLayout} from './components/PageLayout/PageLayout';
import {PageLayoutAside} from './components/PageLayout/PageLayoutAside';
import {AsideHeaderProps} from './types';

export const AsideHeader = React.forwardRef<HTMLDivElement, AsideHeaderProps>(
    ({compact, className, topAlert, menuDensity, invertSoloTooltipTheme, ...props}, ref) => {
        return (
            <PageLayout
                compact={compact}
                className={className}
                topAlert={topAlert}
                menuDensity={menuDensity}
                invertSoloTooltipTheme={invertSoloTooltipTheme}
            >
                <PageLayoutAside ref={ref} {...props} />
                <PageLayout.Content renderContent={props.renderContent} />
            </PageLayout>
        );
    },
);

AsideHeader.displayName = 'AsideHeader';
