import { default as React, PropsWithChildren } from 'react';
export type Props = PropsWithChildren<{
    'aria-label'?: string;
    className?: string;
}>;
declare const PublicActionBar: {
    ({ children, className, "aria-label": ariaLabel }: Props): React.JSX.Element;
    displayName: string;
} & {
    Section: {
        ({ children, type }: import('./Section/ActionBarSection').Props): React.JSX.Element;
        displayName: string;
    };
    Group: {
        ({ children, className, pull }: import('./Group/ActionBarGroup').Props): React.JSX.Element;
        displayName: string;
    };
    Item: {
        ({ children, className, pull, spacing }: import('./Item/ActionBarItem').Props): React.JSX.Element;
        displayName: string;
    };
    Separator: {
        (): React.JSX.Element;
        displayName: string;
    };
};
export { PublicActionBar as ActionBar };
