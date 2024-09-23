import { default as React } from 'react';
import { PopupPlacement, PopupProps } from '@gravity-ui/uikit';
import { MenuItem } from '../../types';
interface ItemPopup {
    popupVisible?: PopupProps['open'];
    popupAnchor?: PopupProps['anchorRef'];
    popupPlacement?: PopupProps['placement'];
    popupOffset?: PopupProps['offset'];
    popupKeepMounted?: PopupProps['keepMounted'];
    popupContentClassName?: PopupProps['contentClassName'];
    renderPopupContent?: () => React.ReactNode;
    onClosePopup?: () => void;
}
export interface ItemProps extends ItemPopup {
    item: MenuItem;
    enableTooltip?: boolean;
    onItemClick?: (item: MenuItem, collapsed: boolean, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onItemClickCapture?: (event: React.SyntheticEvent) => void;
    bringForward?: boolean;
}
interface ItemInnerProps extends ItemProps {
    className?: string;
    collapseItems?: MenuItem[];
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}
export declare const defaultPopupPlacement: PopupPlacement;
export declare const defaultPopupOffset: NonNullable<PopupProps['offset']>;
export declare const Item: React.FC<ItemInnerProps>;
export {};
