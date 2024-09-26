import React, {useCallback} from 'react';

import {Icon} from '@gravity-ui/uikit';

import {block} from '../../../utils/cn';
import {useAsideHeaderInnerContext} from '../../AsideHeaderContext';
import i18n from '../../i18n';

import controlMenuButtonIcon from '/icons/control-menu-button.svg';

import './CollapseButton.scss';

const b = block('collapse-button');

export interface CollapseButtonProps {
    className?: string;
}

export const CollapseButton = ({className}: CollapseButtonProps) => {
    const {onChangeCompact, compact, expandTitle, collapseTitle} = useAsideHeaderInnerContext();

    const onCollapseButtonClick = useCallback(() => {
        onChangeCompact?.(!compact);
    }, [compact, onChangeCompact]);

    const buttonTitle = compact
        ? expandTitle || i18n('button_expand')
        : collapseTitle || i18n('button_collapse');
    return (
        <button
            className={b({compact}, className)}
            onClick={onCollapseButtonClick}
            title={buttonTitle}
        >
            <Icon data={controlMenuButtonIcon} className={b('icon')} width="16" height="10" />
        </button>
    );
};
