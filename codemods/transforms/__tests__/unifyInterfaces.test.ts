import {defineTest} from 'jscodeshift/src/testUtils';

const testName = 'unifyInterfaces';

defineTest(__dirname, testName, null, testName, {
    parser: 'tsx',
});
