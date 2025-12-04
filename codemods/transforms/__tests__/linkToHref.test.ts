import {defineTest} from 'jscodeshift/src/testUtils';

const testName = 'linkToHref';

defineTest(__dirname, testName, null, testName, {
    parser: 'tsx',
});
