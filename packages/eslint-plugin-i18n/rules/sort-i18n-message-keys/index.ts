import type {Rule} from 'eslint';
import type {CallExpression, ObjectExpression, Property} from 'estree';

import {
    DEFAULT_CALL_EXPRESSIONS,
    DEFAULT_FILENAME_MATCHER,
    DEFAULT_MEMBER_EXPRESSIONS,
    FILENAME_MATCHER_SCHEMA_PROPERTY,
    createFilenamePredicate,
    isCreateMessagesCall,
    type FilenameMatcher,
} from '../shared/create-messages-call';

export type SortI18nMessageKeysOptions = {
    memberExpressions?: {member: string; property: string}[];
    callExpressions?: string[];
    filenameMatcher?: FilenameMatcher;
};

const MESSAGE =
    'Locale keys in i18n message objects must be ordered: ru, en, then other locales (source order), then meta.';

function getPropertyKeyName(key: Property['key']): string | null {
    if (key.type === 'Identifier') {
        return key.name;
    }
    if (
        key.type === 'Literal' &&
        (typeof key.value === 'string' || typeof key.value === 'number')
    ) {
        return String(key.value);
    }
    return null;
}

function getObjectProperties(objectExpr: ObjectExpression): Property[] | null {
    const result: Property[] = [];

    for (const prop of objectExpr.properties) {
        if (prop.type === 'SpreadElement') {
            return null;
        }
        if (prop.type === 'Property') {
            result.push(prop);
        }
    }

    return result;
}

function getDesiredPropertyOrder(properties: Property[]): Property[] {
    const ru: Property[] = [];
    const en: Property[] = [];
    const meta: Property[] = [];
    const others: Property[] = [];

    for (const prop of properties) {
        const name = getPropertyKeyName(prop.key);
        if (name === 'ru') {
            ru.push(prop);
        } else if (name === 'en') {
            en.push(prop);
        } else if (name === 'meta') {
            meta.push(prop);
        } else {
            others.push(prop);
        }
    }

    const desired = [...ru, ...en, ...others, ...meta];

    return desired;
}

function propertiesAreInOrder(current: Property[], desired: Property[]): boolean {
    return desired.every((node, index) => node === current[index]);
}

function pickPropertySeparator(sourceCodeText: string, properties: Property[]): string {
    if (properties.length < 2) {
        return ', ';
    }

    const first = properties[0];
    const second = properties[1];

    if (!first || !second) {
        return ', ';
    }

    const start = first.range?.[1];
    const end = second.range?.[0];

    if (start === undefined || end === undefined) {
        return ', ';
    }

    return sourceCodeText.slice(start, end);
}

export const rule: Rule.RuleModule = {
    meta: {
        type: 'layout',
        fixable: 'code',
        docs: {
            description: MESSAGE,
        },
        messages: {
            wrongKeyOrder: MESSAGE,
        },
        schema: [
            {
                type: 'object',
                properties: {
                    memberExpressions: {type: 'array'},
                    callExpressions: {type: 'array'},
                    filenameMatcher: FILENAME_MATCHER_SCHEMA_PROPERTY,
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const options: SortI18nMessageKeysOptions = context.options[0] || {};
        const memberExpressions = options.memberExpressions ?? DEFAULT_MEMBER_EXPRESSIONS;
        const callExpressions = options.callExpressions ?? DEFAULT_CALL_EXPRESSIONS;
        const filenameMatcher = options.filenameMatcher ?? DEFAULT_FILENAME_MATCHER;
        const matchesFilename = createFilenamePredicate(filenameMatcher);

        const filename = context.getFilename();

        if (!matchesFilename(filename)) {
            return {};
        }

        const sourceCode = context.getSourceCode();

        function visitCreateMessagesCall(node: CallExpression) {
            if (!isCreateMessagesCall(node, sourceCode, memberExpressions, callExpressions)) {
                return;
            }

            const arg0 = node.arguments[0];
            if (!arg0 || arg0.type !== 'ObjectExpression') {
                return;
            }

            for (const translation of arg0.properties) {
                if (translation.type !== 'Property') {
                    continue;
                }

                const value = translation.value;
                if (value.type !== 'ObjectExpression') {
                    continue;
                }

                const properties = getObjectProperties(value);
                if (!properties || properties.length < 2) {
                    continue;
                }

                const desired = getDesiredPropertyOrder(properties);
                if (propertiesAreInOrder(properties, desired)) {
                    continue;
                }

                context.report({
                    node: value,
                    messageId: 'wrongKeyOrder',
                    fix(fixer) {
                        const first = properties[0]!;
                        const last = properties[properties.length - 1]!;

                        if (first.range === undefined || last.range === undefined) {
                            return null;
                        }

                        const lastToken = sourceCode.getLastToken(value);
                        if (!lastToken || lastToken.value !== '}') {
                            return null;
                        }

                        const afterLast = sourceCode.text.slice(last.range[1], lastToken.range[0]);
                        const trailingCommaMatch = afterLast.match(/^\s*,/);
                        const replaceEnd = trailingCommaMatch
                            ? last.range[1] + trailingCommaMatch[0].length
                            : last.range[1];

                        const sep = pickPropertySeparator(sourceCode.getText(), properties);
                        const body = desired.map((p) => sourceCode.getText(p)).join(sep);
                        const newText = body + (trailingCommaMatch ? ',' : '');

                        return fixer.replaceTextRange([first.range[0], replaceEnd], newText);
                    },
                });
            }
        }

        return {
            CallExpression: visitCreateMessagesCall,
        };
    },
};
