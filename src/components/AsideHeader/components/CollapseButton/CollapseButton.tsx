import React, {useCallback} from 'react';

import {ChevronRight} from '@gravity-ui/icons';
import {Icon} from '@gravity-ui/uikit';

import {createBlock} from '../../../utils/cn';
import {useAsideHeaderInnerContext} from '../../AsideHeaderContext';
import {getAsideHeaderDensityConfig} from '../../density';
import i18n from '../../i18n';

import styles from './CollapseButton.module.scss';

const b = createBlock('collapse-button', styles);

// Tab outline: concave fillets into the aside edge, convex outer corners, half-pixel stroke.
const tabPath = (h: number) =>
    `M0 0 A10 10 0 0 0 10 10 A9.5 9.5 0 0 1 19.5 19.5 V${h + 0.5} A9.5 9.5 0 0 1 10 ${h + 10} A10 10 0 0 0 0 ${h + 20}`;

interface CollapseButtonProps {
    panelId: string;
    slotRef: React.RefObject<HTMLDivElement>;
    className?: string;
}

export const CollapseButton = ({className, panelId, slotRef}: CollapseButtonProps) => {
    const {
        onChangeCompact,
        compact,
        expandTitle,
        collapseTitle,
        collapseButtonWrapper,
        menuDensity,
    } = useAsideHeaderInnerContext();
    const {footerItemHeight} = getAsideHeaderDensityConfig(menuDensity);
    const tabShape = compact ? tabPath(footerItemHeight) : null;

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
            {tabShape && (
                <svg
                    className={b('tab-shape')}
                    viewBox={`0 0 20 ${footerItemHeight + 20}`}
                    aria-hidden="true"
                    focusable="false"
                >
                    <path className={b('tab-shape-fill')} d={`${tabShape} Z`} />
                    <path className={b('tab-shape-hover')} d={`${tabShape} Z`} />
                    <path className={b('tab-shape-line')} d={tabShape} />
                </svg>
            )}
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
