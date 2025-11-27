import React, {useCallback} from 'react';

import {Icon} from '@gravity-ui/uikit';

import {block} from '../../../utils/cn';
import {useAsideHeaderContext, useAsideHeaderInnerContext} from '../../AsideHeaderContext';
import i18n from '../../i18n';

import controlMenuButtonIcon from '../../../../../assets/icons/control-menu-button.svg';

import './CollapseButton.scss';

const b = block('collapse-button');

interface CollapseButtonProps {
    className?: string;
}

export const CollapseButton = ({className}: CollapseButtonProps) => {
    const {compact, onChangeCompact} = useAsideHeaderContext();
    const {expandTitle, collapseTitle, collapseButtonWrapper} = useAsideHeaderInnerContext();

    const onCollapseButtonClick = useCallback(() => {
        const newCompact = !compact;

        onChangeCompact?.(newCompact);
    }, [compact, onChangeCompact]);

    const buttonTitle = compact
        ? expandTitle || i18n('button_expand')
        : collapseTitle || i18n('button_collapse');

    const defaultButton = (
        <button
            className={b({compact: compact}, className)}
            onClick={onCollapseButtonClick}
            title={buttonTitle}
        >
            <Icon data={controlMenuButtonIcon} className={b('icon')} width="16" height="10" />
        </button>
    );

    if (collapseButtonWrapper) {
        return collapseButtonWrapper(defaultButton, {
            compact,
            onChangeCompact,
        });
    }

    return defaultButton;
};
