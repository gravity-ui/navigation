import React from 'react';
import {block} from '../../utils/cn';

import {eventBroker, Icon, IconProps, Sheet} from '@gravity-ui/uikit';

// import {Item, ItemProps} from '../CompositeBar/Item/Item';
import {MOBILE_HEADER_ICON_SIZE} from '../constants';
import {MobileItemIconView, ModalItem} from '../types';

import './FooterItem.scss';

const b = block('mobile-header-footer-item');

export interface MobileHeaderFooterItemProps {
    icon?: IconProps['data'];
    iconSize?: string | number;
    view?: MobileItemIconView;
    className?: string;
    modalItem: ModalItem;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const MobileHeaderFooterItem = ({
    icon,
    iconSize = MOBILE_HEADER_ICON_SIZE,
    view,
    className,
    modalItem = {visible: false},
    onClick,
}: MobileHeaderFooterItemProps) => {
    const handleClick = React.useCallback<React.MouseEventHandler<HTMLDivElement>>(
        (event) => {
            eventBroker.publish({
                componentId: 'MobileHeaderFooterItem',
                eventId: 'click',
                domEvent: event,
                meta: {
                    view,
                },
            });

            onClick?.(event);
        },
        [onClick, view],
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
