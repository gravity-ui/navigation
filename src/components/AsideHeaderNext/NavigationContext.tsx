import * as React from 'react';

export type MatchStrategy = 'exact' | 'prefix' | ((href: string, currentPath: string) => boolean);

export interface NavigationContextValue {
    currentPath?: string;
    matchStrategy: MatchStrategy;
}

const NavigationContext = React.createContext<NavigationContextValue>({matchStrategy: 'prefix'});

export const NavigationProvider = NavigationContext.Provider;

function matches(href: string, currentPath: string, strategy: MatchStrategy): boolean {
    if (typeof strategy === 'function') {
        return strategy(href, currentPath);
    }
    if (strategy === 'exact') {
        return href === currentPath;
    }
    if (href === '/') {
        return currentPath === '/';
    }
    return currentPath === href || currentPath.startsWith(`${href}/`);
}

/**
 * Derives `current` from `Root.currentPath` for rows that declare an `href`.
 * An explicit `current` prop on the row always wins over this.
 */
export function useIsCurrent(href: string | undefined): boolean {
    const {currentPath, matchStrategy} = React.useContext(NavigationContext);

    if (!href || currentPath === undefined) {
        return false;
    }

    return matches(href, currentPath, matchStrategy);
}
