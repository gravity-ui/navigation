import React, {useCallback} from 'react';

import {ChevronRight} from '@gravity-ui/icons';
import {Icon} from '@gravity-ui/uikit';

import {createBlock} from '../../../utils/cn';
import {useAsideHeaderInnerContext} from '../../AsideHeaderContext';
import i18n from '../../i18n';

import styles from './CollapseButton.module.scss';

const b = createBlock('collapse-button', styles);

interface CollapseButtonProps {
    panelId: string;
    slotRef: React.RefObject<HTMLDivElement>;
    className?: string;
}

export const CollapseButton = ({className, panelId, slotRef}: CollapseButtonProps) => {
    const {onChangeCompact, compact, expandTitle, collapseTitle, collapseButtonWrapper} =
        useAsideHeaderInnerContext();

    // The button reverses the target state: pressing it while the collapse or
    // expand transition runs must switch the direction instead of re-applying
    // the command the transition is already moving towards.
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
            type="button"
            aria-controls={panelId}
            aria-expanded={!compact}
        >
            <Icon data={ChevronRight} className={b('icon')} size={16} />
        </button>
    );

    const button = collapseButtonWrapper
        ? collapseButtonWrapper(defaultButton, {compact, onChangeCompact})
        : defaultButton;

    return (
        <div data-gn-aside-collapse-layer className={b('layer', {compact})}>
            <div data-gn-aside-collapse-slot className={b('slot', {compact})} ref={slotRef}>
                {button}
            </div>
        </div>
    );
};
