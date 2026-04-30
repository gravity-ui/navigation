import type {SourceCode} from 'eslint';
import type {CallExpression} from 'estree';

import {clearSpaceCharacters} from '../auto-generate-translation-message-id/utils/clear-space-characters';

export type MemberExpressionPattern = {member: string; property: string};

export type I18nCreateMessagesFilenamesOptions = {
    memberExpressions?: MemberExpressionPattern[];
    callExpressions?: string[];
    filenameMatcher?: string;
};

export const DEFAULT_MEMBER_EXPRESSIONS: MemberExpressionPattern[] = [
    {member: 'intl', property: 'createMessages'},
];
export const DEFAULT_CALL_EXPRESSIONS = ['createMessages'];
export const DEFAULT_FILENAME_MATCHER = 'i18n.ts';

export function defaultFilenameMatch(filename: string, suffix: string): boolean {
    const norm = filename.replaceAll('\\', '/');
    return norm.endsWith(`/${suffix}`) || norm === suffix;
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
