import React from 'react';
import {Alert} from '@gravity-ui/uikit';

import {useAsideHeaderInnerContext} from '../AsideHeaderContext';
import {b} from '../utils';

type Props = {
    onClose: () => void;
};

export const TopPanel = React.forwardRef<HTMLDivElement, Props>(({onClose}, ref) => {
    const {topAlert} = useAsideHeaderInnerContext();

    const [opened, setOpened] = React.useState(true);

    const handleClose = React.useCallback(() => {
        setOpened(false);
    }, []);

    React.useEffect(() => {
        if (!opened) {
            onClose();
        }
    }, [opened, onClose]);

    if (!topAlert) {
        return null;
    }

    return (
        <div ref={ref} className={b('pane-top', {opened})}>
            {opened && (
                <React.Fragment>
                    <Alert
                        className={b('pane-top-alert', {centered: topAlert.centered})}
                        corners="square"
                        layout="horizontal"
                        theme={topAlert.theme || 'warning'}
                        icon={topAlert.icon}
                        title={topAlert.title}
                        message={topAlert.message}
                        actions={topAlert.actions}
                        onClose={topAlert.closable ? handleClose : undefined}
                    />
                    <div className={b('pane-top-divider')}></div>
                </React.Fragment>
            )}
        </div>
    );
});
