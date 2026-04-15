import {AsideHeaderItem} from 'src/components/AsideHeader/types';

export interface ItemProps extends AsideHeaderItem {}

export interface ItemInnerProps extends ItemProps {
    className?: string;
    collapseItems?: AsideHeaderItem[];
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}
