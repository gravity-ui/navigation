import React from 'react';
import {Alert} from '@gravity-ui/uikit';

import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import {b} from '../utils';

export const TopPanel = React.forwardRef<HTMLDivElement>((_, ref) => {
    const {topAlert} = useAsideHeaderInnerContext();

    if (!topAlert) {
        return null;
    }

    return (
        <div ref={ref} className={b('pane-top')}>
            <Alert
                corners="square"
                layout="horizontal"
                theme={topAlert.theme || 'warning'}
                icon={topAlert.icon}
                title={topAlert.title}
                message={topAlert.message}
                actions={topAlert.actions}
            />
        </div>
    );
});
