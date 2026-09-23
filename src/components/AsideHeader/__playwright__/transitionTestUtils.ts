import type {Page} from '@playwright/test';

// Freeze browser animations before their first painted frame; tests can then
// inspect exact progress independently of the machine's frame rate.
export async function toggleAsideAndPause(page: Page) {
    await page
        .locator('button[class*="gn-collapse-button_"]')
        .evaluate(async (button: HTMLButtonElement) => {
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

// Pause the next aside transition from the task that starts it. A keyboard toggle reaches the
// page in its own protocol round trip, so pausing on a later frame can land after the short
// transition has already finished on a slow runner. The mutation callback runs as soon as
// the transition marks the panel, after it has created its animations and before any frame.
export async function pauseNextAsideTransition(page: Page) {
    await page.locator('[data-gn-aside-panel]').evaluate((panel) => {
        const observer = new MutationObserver(() => {
            if (!panel.hasAttribute('data-gn-aside-animating')) return;
            observer.disconnect();
            document.getAnimations().forEach((animation) => animation.pause());
        });
        observer.observe(panel, {attributes: true, attributeFilter: ['data-gn-aside-animating']});
    });
}
