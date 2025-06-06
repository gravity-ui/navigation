import React, {useCallback} from 'react';

import {Icon} from '@gravity-ui/uikit';

import {createBlock} from '../../../utils/cn';
import {useAsideHeaderInnerContext} from '../../AsideHeaderContext';
import i18n from '../../i18n';

import controlMenuButtonIcon from '../../../../../assets/icons/control-menu-button.svg';

import styles from './CollapseButton.scss';

const b = createBlock('collapse-button', styles);

interface CollapseButtonProps {
    className?: string;
}

export const CollapseButton = ({className}: CollapseButtonProps) => {
    const {onChangeCompact, compact, expandTitle, collapseTitle, collapseButtonWrapper} =
        useAsideHeaderInnerContext();

    const onCollapseButtonClick = useCallback(() => {
        onChangeCompact?.(!compact);
    }, [compact, onChangeCompact]);

    const buttonTitle = compact
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
