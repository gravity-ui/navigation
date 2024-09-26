import React from 'react';

import {ArrowLeft as CloseIcon} from '@gravity-ui/icons';
import {Button, Icon, IconProps, Text} from '@gravity-ui/uikit';

import {Drawer, DrawerItem} from '../../Drawer/Drawer';
import {block} from '../../utils/cn';
import {MOBILE_HEADER_ICON_SIZE} from '../constants';
import i18n from '../i18n';

import './OverlapPanel.scss';

const b = block('mobile-overlap-panel');

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
    return (
        <Drawer
            className={b('', {action: Boolean(action)}, className)}
            onVeilClick={onClose}
            onEscape={onClose}
            preventScrollBody
            style={{
                top: topOffset,
            }}
        >
            <DrawerItem id="overlap" visible={visible} className={b('drawer-item')}>
                <div className={b('header')}>
                    <Button
                        size="l"
                        view="flat"
                        className={b('close')}
                        onClick={onClose}
                        extraProps={{
                            'aria-label': closeTitle,
                        }}
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
                            extraProps={{
                                'aria-label': action.title,
                            }}
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
