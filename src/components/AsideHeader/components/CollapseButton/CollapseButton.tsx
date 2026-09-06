import React, {useCallback} from 'react';

import {Icon} from '@gravity-ui/uikit';

import {createBlock} from '../../../utils/cn';
import {useAsideHeaderInnerContext} from '../../AsideHeaderContext';
import i18n from '../../i18n';

import controlMenuButtonIcon from '../../../../../assets/icons/control-menu-button.svg';

import styles from './CollapseButton.module.scss';

const b = createBlock('collapse-button', styles);

interface CollapseButtonProps {
    className?: string;
}

export const CollapseButton = ({className}: CollapseButtonProps) => {
    const {
        onChangeCompact,
        compact,
        presentationCompact = compact,
        expandTitle,
        collapseTitle,
        collapseButtonWrapper,
    } = useAsideHeaderInnerContext();

    // The button reverses the target state: pressing it while the collapse or
    // expand transition runs must switch the direction instead of re-applying
    // the command the transition is already moving towards.
    const onCollapseButtonClick = useCallback(() => {
        onChangeCompact?.(!compact);
    }, [compact, onChangeCompact]);

    const buttonTitle = presentationCompact
        ? expandTitle || i18n('button_expand')
        : collapseTitle || i18n('button_collapse');

    const defaultButton = (
        <button
            className={b({compact: presentationCompact}, className)}
            onClick={onCollapseButtonClick}
            title={buttonTitle}
        >
            <Icon data={controlMenuButtonIcon} className={b('icon')} width="16" height="10" />
        </button>
    );

    if (collapseButtonWrapper) {
        // The wrapper drives the aside, so it needs the target state for its
        // own control logic — not the lagging presentation the default button
        // is rendered with.
        return collapseButtonWrapper(defaultButton, {
            compact,
            onChangeCompact,
        });
    }

    return defaultButton;
};
