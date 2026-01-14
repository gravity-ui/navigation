import {defineTest} from 'jscodeshift/src/testUtils';

const testName = 'compactToIsExpanded';

defineTest(__dirname, testName, null, testName, {
    parser: 'tsx',
});
