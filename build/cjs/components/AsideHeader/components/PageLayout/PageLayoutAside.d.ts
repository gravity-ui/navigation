import { default as React } from 'react';
import { AsideHeaderProps } from '../../types';
type Props = Omit<AsideHeaderProps, 'compact' | 'size'>;
export declare const PageLayoutAside: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLDivElement>>;
export {};
