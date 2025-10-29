import React, {useCallback} from 'react';

import {Icon} from '@gravity-ui/uikit';

import {block} from '../../../utils/cn';
import {useAsideHeaderInnerContext} from '../../AsideHeaderContext';
import i18n from '../../i18n';

import controlMenuButtonIcon from '../../../../../assets/icons/control-menu-button.svg';

import './CollapseButton.scss';

const b = block('collapse-button');

export interface CollapseButtonProps {
    className?: string;
}

export const CollapseButton = ({className}: CollapseButtonProps) => {
    const {
        onChangeCompact,
        compact,
        expandTitle,
        collapseTitle,
        collapseButtonWrapper,
        isPinned,
        pin,
        unpin,
    } = useAsideHeaderInnerContext();

    const onCollapseButtonClick = useCallback(() => {
        if (isPinned) {
            unpin();
        } else {
            pin();
        }
    }, [isPinned, unpin, pin]);

    const buttonTitle = isPinned
        ? expandTitle || i18n('button_expand')
        : collapseTitle || i18n('button_collapse');

    const defaultButton = (
        <button
            className={b({compact}, className)}
            onClick={onCollapseButtonClick}
            title={buttonTitle}
        >
            <Icon data={controlMenuButtonIcon} className={b('icon')} width="16" height="10" />
        </button>
    );

    if (collapseButtonWrapper) {
        return collapseButtonWrapper(defaultButton, {compact, onChangeCompact});
    }

    return defaultButton;
};
