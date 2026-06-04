import type {TestRunnerConfig} from '@storybook/test-runner';
import {getStoryContext, waitForPageReady} from '@storybook/test-runner';
import {checkA11y, configureAxe, injectAxe} from 'axe-playwright';

/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
const config: TestRunnerConfig = {
    async postVisit(page, context) {
        // Get the entire context of a story, including parameters, args, argTypes, etc.
        const storyContext = await getStoryContext(page, context);

        // Wait until the page is fully ready — including any navigation a story may
        // trigger — then inject a fresh axe instance. A story-triggered navigation
        // could leave the previously injected axe mid-run, making the next
        // checkA11y fail with "Axe is already running"; the previous fixed delay
        // mitigated this only flakily.
        await waitForPageReady(page);
        await injectAxe(page);

        // Apply story-level a11y rules
        await configureAxe(page, {
            rules: storyContext.parameters?.a11y?.config?.rules,
            reporter: 'no-passes',
        });

        await checkA11y(page, '#storybook-root', {
            verbose: false,
            detailedReport: true,
            detailedReportOptions: {
                html: true,
            },
        });
    },
};

export default config;
