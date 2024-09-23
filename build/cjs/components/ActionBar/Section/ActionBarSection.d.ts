import React, { PropsWithChildren } from 'react';
import './ActionBarSection.scss';
export type Props = PropsWithChildren<{
    type?: 'primary' | 'secondary';
}>;
export declare const ActionBarSection: {
    ({ children, type }: Props): React.JSX.Element;
    displayName: string;
};
