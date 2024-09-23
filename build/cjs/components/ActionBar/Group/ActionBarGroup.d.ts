import React, { PropsWithChildren } from 'react';
import { PropsWithPull } from '../types';
import './ActionBarGroup.scss';
export type Props = PropsWithChildren<PropsWithPull<{
    className?: string;
}>>;
export declare const ActionBarGroup: {
    ({ children, className, pull }: Props): React.JSX.Element;
    displayName: string;
};
