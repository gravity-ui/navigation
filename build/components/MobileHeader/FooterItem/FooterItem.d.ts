import { default as React } from 'react';
import { IconProps } from '@gravity-ui/uikit';
import { ModalItem } from '../types';
export interface FooterItemProps {
    icon?: IconProps['data'];
    iconSize?: string | number;
    className?: string;
    modalItem?: ModalItem;
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    eventBrokerMeta?: Record<string, string | undefined>;
}
export declare const FooterItem: ({ icon, iconSize, className, modalItem, onClick, eventBrokerMeta, }: FooterItemProps) => React.JSX.Element;
