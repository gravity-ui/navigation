import React from 'react';
import './Title.scss';
interface TitleProps {
    hasSeparator?: boolean;
    closeTitle?: string;
    closeIconSize?: number;
    onClose?: () => void;
}
export declare const Title: React.FC<React.PropsWithChildren<TitleProps>>;
export {};
