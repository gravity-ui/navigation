import React from 'react';

import {ArrowLeft as CloseIcon} from '@gravity-ui/icons';
import {Button, Icon, IconProps, Text} from '@gravity-ui/uikit';

import {Drawer, DrawerItem} from '../../Drawer/Drawer';
import {createBlock} from '../../utils/cn';
import {MOBILE_HEADER_ICON_SIZE} from '../constants';
import i18n from '../i18n';

import styles from './OverlapPanel.scss';

const b = createBlock('mobile-overlap-panel', styles);

interface OverlapPanelActionProps {
    icon: IconProps['data'];
    className?: string;
    onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    title: string;
}

export interface OverlapPanelProps {
    className?: string;
    title?: string;
    onClose: () => void;
    action?: OverlapPanelActionProps;
    renderContent: () => React.ReactNode;
    closeTitle?: string;
    visible: boolean;
    topOffset?: number | string;
}

export const OverlapPanel = ({
    title,
    renderContent,
    className,
    onClose,
    action,
    closeTitle = i18n('overlap_button_close'),
    visible,
    topOffset,
}: OverlapPanelProps) => {
    const topOffsetValue = typeof topOffset === 'number' ? `${topOffset}px` : topOffset;
    const [itemPosition, setItemPosition] = React.useState<React.CSSProperties['position']>();

    const drawerStyle = React.useMemo(
        () => ({top: `calc(${topOffsetValue} + var(--gn-top-alert-height, 0px))`}),
        [topOffsetValue],
    );

    const drawerItemStyle = React.useMemo(
        () =>
            itemPosition === 'absolute'
                ? {}
                : {top: `calc(${topOffsetValue} + var(--gn-top-alert-height, 0px))`},
        [topOffsetValue, itemPosition],
    );

    const itemRef = React.useRef<HTMLDivElement>(null);

    // It is necessary to determine the position of the DrawerItem in order to correctly set the top offset
    React.useLayoutEffect(() => {
        if (itemRef.current) {
            const style = getComputedStyle(itemRef.current);
            const position = style.position as React.CSSProperties['position'];
            setItemPosition(position);
        }
    }, []);

    return (
        <Drawer
            className={b('', {action: Boolean(action)}, className)}
            onVeilClick={onClose}
            onEscape={onClose}
            style={drawerStyle}
        >
            <DrawerItem
                id="overlap"
                ref={itemRef}
                visible={visible}
                className={b('drawer-item')}
                style={drawerItemStyle}
            >
                <div className={b('header')}>
                    <Button
                        size="l"
                        view="flat"
                        className={b('close')}
                        onClick={onClose}
                        aria-label={closeTitle}
                    >
                        <Icon
                            className={b('icon')}
                            data={CloseIcon}
                            size={MOBILE_HEADER_ICON_SIZE}
                        />
                    </Button>
                    <Text
                        whiteSpace="nowrap"
                        ellipsis
                        variant={'subheader-2'}
                        className={b('title')}
                        as={title ? ('h2' as const) : undefined}
                    >
                        {title}
                    </Text>
                    {action && (
                        <Button
                            size="l"
                            type="button"
                            view="flat"
                            onClick={action.onClick}
                            className={b('action')}
                            aria-label={action.title}
                        >
                            <Icon data={action.icon} size={MOBILE_HEADER_ICON_SIZE} />
                        </Button>
                    )}
                </div>
                <div className={b('content')}>{renderContent()}</div>
            </DrawerItem>
        </Drawer>
    );
};
