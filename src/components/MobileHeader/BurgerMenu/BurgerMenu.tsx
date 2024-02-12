import React from 'react';

import {Sheet} from '@gravity-ui/uikit';

import {block} from '../../utils/cn';
import {MobileMenuItem, ModalItem} from '../types';

import {BurgerCompositeBar} from './BurgerCompositeBar/BurgerCompositeBar';

import './BurgerMenu.scss';

const b = block('mobile-header-burger-menu');

export interface BurgerMenuInnerProps {
    items?: MobileMenuItem[];
    modalItem?: ModalItem;
    renderFooter?: () => React.ReactNode;
    onItemClick?: (item: MobileMenuItem) => void;
    className?: string;
}

export const BurgerMenu = React.memo(
    ({items = [], renderFooter, modalItem, className, onItemClick}: BurgerMenuInnerProps) => {
        return (
            <div className={b(null, className)}>
                {modalItem && (
                    <Sheet
                        visible={modalItem.visible}
                        id={modalItem.id}
                        title={modalItem.title}
                        onClose={modalItem.onClose}
                        contentClassName={modalItem.contentClassName}
                        className={modalItem.className}
                    >
                        {modalItem.renderContent?.()}
                    </Sheet>
                )}

                <BurgerCompositeBar items={items} onItemClick={onItemClick} />

                {renderFooter && <div className={b('footer')}>{renderFooter?.()}</div>}
            </div>
        );
    },
);

BurgerMenu.displayName = 'BurgerMenu';
