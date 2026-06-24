import React, {useCallback} from 'react';

import {ArrowLeftToLine, ArrowRightToLine} from '@gravity-ui/icons';

import {createBlock} from '../../../utils/cn';
import {useAsideHeaderInnerContext} from '../../AsideHeaderContext';
import i18n from '../../i18n';
import {FooterItem} from '../FooterItem/FooterItem';

import styles from './CollapseButton.module.scss';

const b = createBlock('collapse-button', styles);

const COLLAPSE_BUTTON_ITEM_ID = 'aside-header-collapse';

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
        <FooterItem
            id={COLLAPSE_BUTTON_ITEM_ID}
            className={b(null, className)}
            icon={compact ? ArrowRightToLine : ArrowLeftToLine}
            title={buttonTitle}
            tooltipText={buttonTitle}
            compact={compact}
            onItemClick={onCollapseButtonClick}
            qa="aside-header-collapse-button"
        />
    );

    if (collapseButtonWrapper) {
        return collapseButtonWrapper(defaultButton, {compact, onChangeCompact});
    }

    return defaultButton;
};
