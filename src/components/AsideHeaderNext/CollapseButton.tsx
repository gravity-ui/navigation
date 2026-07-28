import * as React from 'react';

import {ArrowChevronLeft, ArrowChevronRight} from '@gravity-ui/icons';
import {Icon} from '@gravity-ui/uikit';

import {createBlock} from '../utils/cn';

import {useLayoutContext} from './LayoutContext';
import {withSlot} from './internal/slots';
import {RenderProp, useRenderElement} from './internal/useRenderElement';

import styles from './CollapseButton.module.scss';

const b = createBlock('aside-header-next-collapse', styles);

export interface CollapseButtonState extends Record<string, unknown> {
    compact: boolean;
}

export interface CollapseButtonProps {
    className?: string;
    collapseTitle?: string;
    expandTitle?: string;
    render?: RenderProp<CollapseButtonState>;
    ref?: React.Ref<HTMLButtonElement>;
}

function CollapseButtonComponent(props: CollapseButtonProps) {
    const {className, collapseTitle = 'Collapse', expandTitle = 'Expand', render, ref} = props;
    const {compact, setCompact} = useLayoutContext();

    return useRenderElement<CollapseButtonState>('button', {
        render,
        ref,
        state: {compact},
        props: [
            {
                type: 'button',
                className: b({compact}, className),
                'aria-label': compact ? expandTitle : collapseTitle,
                title: compact ? expandTitle : collapseTitle,
                onClick: () => setCompact(!compact),
                children: <Icon data={compact ? ArrowChevronRight : ArrowChevronLeft} size={16} />,
            },
        ],
    });
}

export const CollapseButton = withSlot(CollapseButtonComponent, 'footer');
