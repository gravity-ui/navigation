import React from 'react';
import {Sheet} from '@gravity-ui/uikit';
import {block} from '../../utils/cn';

import {MobileMenuItem, ModalItem} from '../types';
import {BurgerCompositeBar} from './BurgerCompositeBar/BurgerCompositeBar';

import './BurgerMenu.scss';

const b = block('mobile-header-burger-menu');

export interface BurgerMenuProps {
    items: MobileMenuItem[];
    modalItem?: ModalItem;
    onClick?: (item: MobileMenuItem) => void;
    renderBurgerFooter?: () => React.ReactNode;
    className?: string;
}

export const BurgerMenu = React.memo(
    ({items, onClick, renderBurgerFooter, modalItem, className}: BurgerMenuProps) => {
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

                <BurgerCompositeBar items={items} onItemClick={onClick} />

                {renderBurgerFooter && <div className={b('footer')}>{renderBurgerFooter?.()}</div>}
            </div>
        );
    },
);

BurgerMenu.displayName = 'BurgerMenu';
