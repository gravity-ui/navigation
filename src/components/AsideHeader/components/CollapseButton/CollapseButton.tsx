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
            className={b({collapsed: compact}, className)}
            onClick={onCollapseButtonClick}
            aria-label={buttonTitle}
            title={buttonTitle}
        >
            <Icon data={ArrowLeftFromLine} className={b('icon')} size={16} />
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
