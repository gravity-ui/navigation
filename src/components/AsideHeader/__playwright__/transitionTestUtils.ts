import type {Page} from '@playwright/test';

// Freeze browser animations before their first painted frame; tests can then
// inspect exact progress independently of the machine's frame rate.
export async function toggleAsideAndPause(page: Page) {
    await page.evaluate(async () => {
        const button = document.querySelector<HTMLButtonElement>(
            'button[class*="gn-collapse-button_"]',
        );
        if (!button) throw new Error('Collapse button missing');
        button.click();
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        document.getAnimations().forEach((animation) => animation.pause());
    });
}

export async function seekAnimations(page: Page, progress: number) {
    await page.evaluate((fraction) => {
        document.getAnimations().forEach((animation) => {
            // eslint-disable-next-line no-param-reassign
            animation.currentTime =
                Number(animation.effect?.getComputedTiming().duration ?? 0) * fraction;
        });
    }, progress);
}

export async function finishAnimations(page: Page) {
    await page.evaluate(async () => {
        const animations = document.getAnimations();
        animations.forEach((animation) => animation.finish());
        await Promise.all(animations.map((animation) => animation.finished.catch(() => undefined)));
    });
}
