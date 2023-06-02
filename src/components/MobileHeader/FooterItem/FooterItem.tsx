import React from 'react';
import {block} from '../../utils/cn';

import {eventBroker, Icon, IconProps, Sheet} from '@gravity-ui/uikit';

import {MOBILE_HEADER_ICON_SIZE} from '../constants';
import {ModalItem} from '../types';

import './FooterItem.scss';

const b = block('mobile-header-footer-item');

export interface FooterItemProps {
    icon?: IconProps['data'];
    iconSize?: string | number;
    className?: string;
    modalItem: ModalItem;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const FooterItem = ({
    icon,
    iconSize = MOBILE_HEADER_ICON_SIZE,
    className,
    modalItem = {visible: false},
    onClick,
}: FooterItemProps) => {
    const handleClick = React.useCallback<React.MouseEventHandler<HTMLDivElement>>(
        (event) => {
            eventBroker.publish({
                componentId: 'MobileHeaderFooterItem',
                eventId: 'click',
                domEvent: event,
            });

            onClick?.(event);
        },
        [onClick],
    );

    return (
        <div className={b(null, className)} onClick={handleClick}>
            <div>{icon ? <Icon data={icon} size={iconSize} className={b('icon')} /> : null}</div>

            <Sheet
                id={modalItem.id}
                title={modalItem.title}
                visible={modalItem.visible}
                className={b('modal', modalItem.className)}
                contentClassName={b('modal-content', modalItem.contentClassName)}
                allowHideOnContentScroll={modalItem.modalAllowHideOnContentScroll}
                onClose={modalItem.onClose}
            >
                {modalItem.renderContent?.()}
            </Sheet>
        </div>
    );
};