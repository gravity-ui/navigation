import React, {useCallback} from 'react';

import {Button, Icon} from '@gravity-ui/uikit';

import {block} from '../../../utils/cn';
import {useAsideHeaderContext, useAsideHeaderInnerContext} from '../../AsideHeaderContext';
import i18n from '../../i18n';

import ArrowLeftFromLineIcon from '@gravity-ui/icons/svgs/arrow-left-from-line.svg';

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
        <Button
            view="flat-secondary"
            size="l"
            className={b({compact}, className)}
            onClick={onCollapseButtonClick}
            aria-label={buttonTitle}
        >
            <Icon data={ArrowLeftFromLineIcon} className={b('icon')} size={16} />
        </Button>
    );

    if (collapseButtonWrapper) {
        return collapseButtonWrapper(defaultButton, {
            compact,
            onChangeCompact,
        });
    }

    return defaultButton;
};
