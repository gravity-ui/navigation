import {defineTest} from 'jscodeshift/src/testUtils';

const testName = 'v4';

defineTest(__dirname, testName, null, testName, {
    parser: 'tsx',
});
