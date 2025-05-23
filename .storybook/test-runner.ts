import type {TestRunnerConfig} from '@storybook/test-runner';
import {getStoryContext, waitForPageReady} from '@storybook/test-runner';
import {checkA11y, configureAxe, injectAxe} from 'axe-playwright';

/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
const config: TestRunnerConfig = {
    async preVisit(page) {
        await injectAxe(page);
    },
    async postVisit(page, context) {
        // Get the entire context of a story, including parameters, args, argTypes, etc.
        const storyContext = await getStoryContext(page, context);

        // Apply story-level a11y rules
        await configureAxe(page, {
            rules: storyContext.parameters?.a11y?.config?.rules,
            reporter: 'no-passes',
        });

        // hack for prevent error "Axe is already running"
        await new Promise((resolve) => setTimeout(resolve, 1000));
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
