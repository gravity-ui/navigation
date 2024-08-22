import React from 'react';

import {Alert} from '@gravity-ui/uikit';

import {AsideHeaderTopAlertProps} from '../../types';
import {useAsideHeaderTopPanel} from '../useAsideHeaderTopPanel';
import {b} from '../utils';

type Props = {
    topAlert?: AsideHeaderTopAlertProps;
};

export const TopPanel = ({topAlert}: Props) => {
    const {topRef, updateTopSize} = useAsideHeaderTopPanel({topAlert});

    const [opened, setOpened] = React.useState(true);

    const handleClose = React.useCallback(() => {
        setOpened(false);
        topAlert?.onCloseTopAlert?.();
    }, [topAlert]);

    React.useEffect(() => {
        if (!opened) {
            updateTopSize();
        }
    }, [opened, updateTopSize]);

    if (!topAlert || !topAlert.message) {
        return null;
    }

    return (
        <div ref={topRef} className={b('pane-top', {opened})}>
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
                        view={topAlert.view}
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
};
