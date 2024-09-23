import { default as React, PropsWithChildren } from 'react';
export type Props = PropsWithChildren<{
    type?: 'primary' | 'secondary';
}>;
export declare const ActionBarSection: {
    ({ children, type }: Props): React.JSX.Element;
    displayName: string;
};
