import React from 'react';
import {Alert} from '@gravity-ui/uikit';

import {b} from '../utils';
import {AsideHeaderTopAlertProps} from '../../types';

type Props = {
    topAlert?: AsideHeaderTopAlertProps;
};

export const TopPanel = React.forwardRef<HTMLDivElement, Props>(({topAlert}) => {
    const [opened, setOpened] = React.useState(true);

    const handleClose = React.useCallback(() => {
        setOpened(false);
    }, []);

    React.useEffect(() => {
        if (!opened) {
            topAlert?.onCloseTopAlert?.();
        }
    }, [opened, topAlert]);

    if (!topAlert || !topAlert.message) {
        return null;
    }

    return (
        <div ref={topAlert?.ref} className={b('pane-top', {opened})}>
            {opened && (
                <React.Fragment>
                    <Alert
                        className={b('pane-top-alert', {
                            centered: topAlert.centered,
                            dense: topAlert.dense,
                        })}
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
