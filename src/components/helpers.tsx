import React from 'react';

export function fakeDisplayName<T extends {}>(newDisplayName: string, Component: React.FC<T>) {
    const Fake = (props: T) => <Component {...props} />;
    Fake.displayName = newDisplayName;
    return Fake;
}
