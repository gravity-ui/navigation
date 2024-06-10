import React, {useCallback} from 'react';

import {Button, Icon} from '@gravity-ui/uikit';

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
    const {onChangeCompact, compact, expandTitle, collapseTitle} = useAsideHeaderInnerContext();

    const onCollapseButtonClick = useCallback(() => {
        onChangeCompact?.(!compact);
    }, [compact, onChangeCompact]);

    const buttonTitle = compact
        ? expandTitle || i18n('button_expand')
        : collapseTitle || i18n('button_collapse');
    return (
        <div className={b(null, className)}>
            <Button
                className={b('button', {compact})}
                view="flat"
                pin="brick-brick"
                onClick={onCollapseButtonClick}
                title={buttonTitle}
                width="max"
            >
                <Icon data={controlMenuButtonIcon} className={b('icon')} width="16" height="10" />
            </Button>
        </div>
    );
};
