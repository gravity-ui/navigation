import {defineTest} from 'jscodeshift/src/testUtils';

const testName = 'compactToPinned';

defineTest(__dirname, testName, null, testName, {
    parser: 'tsx',
});
