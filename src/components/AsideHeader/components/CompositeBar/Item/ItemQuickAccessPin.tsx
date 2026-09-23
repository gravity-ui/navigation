import React from 'react';

import {Pin, PinFill} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';

import {createBlock} from '../../../../utils/cn';
import i18n from '../../../i18n';

import styles from './Item.module.scss';

const b = createBlock('composite-bar-item', styles);

type ItemQuickAccessPinProps = {
    quickAccess?: boolean;
    onToggle: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export const ItemQuickAccessPin: React.FC<ItemQuickAccessPinProps> = ({quickAccess, onToggle}) => {
    const label = quickAccess ? i18n('quick_access_unpin') : i18n('quick_access_pin');
    const handleClick = React.useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            event.stopPropagation();
            onToggle(event);
        },
        [onToggle],
    );

    return (
        <Button
            className={b('quick-access-pin', {pinned: quickAccess})}
            view="flat-secondary"
            size="s"
            onClick={handleClick}
            aria-label={label}
            title={label}
        >
            <Button.Icon>
                <Icon data={quickAccess ? PinFill : Pin} />
            </Button.Icon>
        </Button>
    );
};

ItemQuickAccessPin.displayName = 'ItemQuickAccessPin';
