import React from 'react';

import {Icon, IconProps, Sheet, eventBroker} from '@gravity-ui/uikit';

import {block} from '../../utils/cn';
import {MOBILE_HEADER_ICON_SIZE} from '../constants';
import {ModalItem} from '../types';

import './FooterItem.scss';

const b = block('mobile-header-footer-item');

export interface FooterItemProps {
    icon?: IconProps['data'];
    iconSize?: string | number;
    className?: string;
    modalItem?: ModalItem;
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    eventBrokerMeta?: Record<string, string | undefined>;
}

export const FooterItem = ({
    icon,
    iconSize = MOBILE_HEADER_ICON_SIZE,
    className,
    modalItem = {visible: false},
    onClick,
    eventBrokerMeta,
}: FooterItemProps) => {
    const handleClick = React.useCallback(
        (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
            eventBroker.publish({
                componentId: 'MobileHeaderFooterItem',
                eventId: 'click',
                domEvent: event,
                meta: eventBrokerMeta,
            });

            onClick?.(event);
        },
        [onClick],
    );

    return (
        <div className={b()}>
            <button className={b('button', className)} onClick={handleClick}>
                {icon ? <Icon data={icon} size={iconSize} className={b('icon')} /> : null}
            </button>

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
