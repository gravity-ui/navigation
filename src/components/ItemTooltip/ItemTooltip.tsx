import React from 'react';
import {block} from '../utils/cn';
import {Popup, PopupPlacement} from '@gravity-ui/uikit';

import './ItemTooltip.scss';

const b = block('item-tooltip');
const popupPlacement: PopupPlacement = ['right'];

export interface ItemTooltipProps {
    anchor: HTMLElement | null;
    text: React.ReactNode;
}

export const ItemTooltip: React.FC<ItemTooltipProps> = ({anchor, text}) => {
    const anchorRef = React.useRef(anchor);

    React.useEffect(() => {
        anchorRef.current = anchor;
    }, [anchor]);

    if (!anchor) {
        return null;
    }

    return (
        <Popup
            className={b()}
            open={true}
            anchorRef={anchorRef}
            placement={popupPlacement}
            disableEscapeKeyDown={true}
            disableOutsideClick={true}
            disableLayer={true}
        >
            <div className={b('text')}>{text}</div>
        </Popup>
    );
};
