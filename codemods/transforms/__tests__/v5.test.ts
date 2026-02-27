import {defineTest} from 'jscodeshift/src/testUtils';

const testName = 'v5';

defineTest(__dirname, testName, null, testName, {
    parser: 'tsx',
});
