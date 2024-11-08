import React from 'react';

import {Alert} from '@gravity-ui/uikit';

import {TopAlertProps} from '../types';
import {block} from '../utils/cn';

import {useTopAlertHeight} from './useTopAlertHeight';

import './TopAlert.scss';

const b = block('top-alert');

type Props = {
    alert?: TopAlertProps;
    className?: string;
};

export const TopAlert = ({alert, className}: Props) => {
    const {alertRef, updateTopSize} = useTopAlertHeight({alert});

    const [opened, setOpened] = React.useState(true);

    const handleClose = React.useCallback(() => {
        setOpened(false);
        alert?.onCloseTopAlert?.();
    }, [alert]);

    React.useEffect(() => {
        if (!opened) {
            updateTopSize();
        }
    }, [opened, updateTopSize]);

    if (!alert || !alert.message) {
        return null;
    }

    return (
        <div ref={alertRef} className={b('wrapper', className)}>
            {opened && (
                <Alert
                    className={b('', {
                        centered: alert.centered,
                        dense: alert.dense,
                    })}
                    corners="square"
                    layout="horizontal"
                    align={alert.align}
                    theme={alert.theme || 'warning'}
                    view={alert.view}
                    icon={alert.icon}
                    title={alert.title}
                    message={alert.message}
                    actions={alert.actions}
                    onClose={alert.closable ? handleClose : undefined}
                />
            )}
        </div>
    );
};
