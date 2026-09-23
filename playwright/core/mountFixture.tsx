import React from 'react';

import type {MountOptions} from '@playwright/experimental-ct-react';

import type {MountFixture, PlaywrightFixture} from './types';

export const mountFixture: PlaywrightFixture<MountFixture> = async (
    {mount: baseMount, page},
    use,
) => {
    const mount = async (
        component: JSX.Element,
        options?: MountOptions<any> | undefined,
        style?: React.CSSProperties,
    ) => {
        const result = await baseMount(
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
        // The base mount resolves right after React 18's `root.render()`, which only schedules
        // the first commit. Wait for it so tests never measure an empty root.
        await page.locator('.playwright-wrapper-test').waitFor({state: 'attached'});
        return result;
    };

    await use(mount);
};
