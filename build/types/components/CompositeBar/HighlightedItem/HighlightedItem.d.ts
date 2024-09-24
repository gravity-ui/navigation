import { default as React } from 'react';
interface ItemInnerProps {
    iconRef: React.RefObject<HTMLDivElement>;
    iconNode: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onClickCapture?: (event: React.SyntheticEvent) => void;
}
export declare const HighlightedItem: React.FC<ItemInnerProps>;
export {};