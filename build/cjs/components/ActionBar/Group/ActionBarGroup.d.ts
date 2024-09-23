import { default as React, PropsWithChildren } from 'react';
import { PropsWithPull } from '../types';
export type Props = PropsWithChildren<PropsWithPull<{
    className?: string;
}>>;
export declare const ActionBarGroup: {
    ({ children, className, pull }: Props): React.JSX.Element;
    displayName: string;
};
