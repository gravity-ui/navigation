import React, { PropsWithChildren } from 'react';
import { PropsWithPull } from '../types';
import './ActionBarItem.scss';
export type Props = PropsWithChildren<PropsWithPull<{
    spacing?: boolean;
    className?: string;
}>>;
export declare const ActionBarItem: {
    ({ children, className, pull, spacing }: Props): React.JSX.Element;
    displayName: string;
};
