import React, {useCallback} from 'react';

import {ArrowLeftFromLine} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';

import {createBlock} from '../../../utils/cn';
import {useAsideHeaderContext, useAsideHeaderInnerContext} from '../../AsideHeaderContext';
import i18n from '../../i18n';

import styles from './CollapseButton.module.scss';

const b = createBlock('collapse-button', styles);

interface CollapseButtonProps {
    className?: string;
    isCompactMode?: boolean;
}

export const CollapseButton = ({className, isCompactMode}: CollapseButtonProps) => {
    const {pinned, onChangePinned} = useAsideHeaderContext();
    const {expandTitle, collapseTitle, collapseButtonWrapper} = useAsideHeaderInnerContext();

    const onCollapseButtonClick = useCallback(() => {
        const newPinned = !pinned;

        onChangePinned?.(newPinned);
    }, [pinned, onChangePinned]);

    const buttonTitle = pinned
        ? collapseTitle || i18n('button_collapse')
        : expandTitle || i18n('button_expand');

    const defaultButton = (
        <Button
            view="flat-secondary"
            size={isCompactMode ? 'm' : 'l'}
            className={b({collapsed: !pinned}, className)}
            onClick={onCollapseButtonClick}
            aria-label={buttonTitle}
            title={buttonTitle}
        >
            <Icon data={ArrowLeftFromLine} className={b('icon')} size={16} />
        </Button>
    );

    if (collapseButtonWrapper) {
        return collapseButtonWrapper(defaultButton, {
            isExpanded: pinned,
            onChangePinned,
        });
    }

    return defaultButton;
};
