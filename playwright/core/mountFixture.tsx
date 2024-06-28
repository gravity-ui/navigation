import React from 'react';

import type {MountOptions} from '@playwright/experimental-ct-react';

import type {MountFixture, PlaywrightFixture} from './types';

export const mountFixture: PlaywrightFixture<MountFixture> = async ({mount: baseMount}, use) => {
    const mount = async (
        component: JSX.Element,
        options?: MountOptions<any> | undefined,
        style?: React.CSSProperties,
    ) => {
        return await baseMount(
            <div
                style={
                    style || {
                        padding: 20,
                        width: 'fit-content',
                        height: 'fit-content',
                    }
                }
                className="playwright-wrapper-test"
            >
                {component}
            </div>,
            options,
        );
    };

    await use(mount);
};
