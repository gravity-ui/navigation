import {Rule} from 'eslint';

import {GenerateId} from './utils';

export interface BaseRuleOptions {
    generateId?: GenerateId;

    namespaceMatchers: RegExp[];
    context: Rule.RuleContext;
    idName: string;
    maxValidLength: number;
    invalidCharsPattern: RegExp;
    invalidCharsReplacement: string;
    invalidCharsReplacer: (substring: string) => string;
    validateId?: boolean;
}
