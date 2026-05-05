import type {SourceCode} from 'eslint';
import type {CallExpression} from 'estree';

import {clearSpaceCharacters} from '../auto-generate-translation-message-id/utils/clear-space-characters';

export type MemberExpressionPattern = {member: string; property: string};

/** File suffix (`path.endsWith('/' + suffix)` or path equals suffix), or regexp on normalized path (`\\` → `/`) via `{ type: 'regexp', pattern }`. */
export type FilenameMatcher =
    | string
    | {
          type: 'regexp';
          pattern: string;
          flags?: string;
      };

export const FILENAME_MATCHER_SCHEMA_PROPERTY = {
    oneOf: [
        {type: 'string'},
        {
            type: 'object',
            properties: {
                type: {enum: ['regexp']},
                pattern: {type: 'string'},
                flags: {type: 'string'},
            },
            required: ['type', 'pattern'],
            additionalProperties: false,
        },
    ],
};

export type I18nCreateMessagesFilenamesOptions = {
    memberExpressions?: MemberExpressionPattern[];
    callExpressions?: string[];
    filenameMatcher?: FilenameMatcher;
};

export const DEFAULT_MEMBER_EXPRESSIONS: MemberExpressionPattern[] = [
    {member: 'intl', property: 'createMessages'},
];
export const DEFAULT_CALL_EXPRESSIONS = ['createMessages'];
export const DEFAULT_FILENAME_MATCHER = 'i18n.ts';

export function createFilenamePredicate(matcher: FilenameMatcher): (filename: string) => boolean {
    if (typeof matcher === 'object' && matcher !== null && matcher.type === 'regexp') {
        let re: RegExp;

        try {
            re = new RegExp(matcher.pattern, matcher.flags ?? '');
        } catch {
            return () => false;
        }

        return (filename) => re.test(filename.replaceAll('\\', '/'));
    }

    if (typeof matcher === 'string') {
        return (filename) => {
            const norm = filename.replaceAll('\\', '/');

            return norm.endsWith(`/${matcher}`) || norm === matcher;
        };
    }

    return () => false;
}

export function isCreateMessagesCall(
    node: CallExpression,
    sourceCode: SourceCode,
    memberExpressions: MemberExpressionPattern[],
    callExpressions: string[],
): boolean {
    const {callee} = node;

    if (callee.type === 'Identifier' && callExpressions.includes(callee.name)) {
        return true;
    }

    if (callee.type === 'MemberExpression' && !callee.optional) {
        const objectText = clearSpaceCharacters(sourceCode.getText(callee.object));
        const rawProperty =
            callee.property.type === 'Identifier' || callee.property.type === 'Literal'
                ? sourceCode.getText(callee.property)
                : '';
        const propertyText = clearSpaceCharacters(rawProperty);

        return memberExpressions.some(
            ({member, property}) => member === objectText && property === propertyText,
        );
    }

    return false;
}
