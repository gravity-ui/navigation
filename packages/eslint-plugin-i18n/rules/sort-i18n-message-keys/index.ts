import type {Rule} from 'eslint';
import type {CallExpression, ObjectExpression, Property} from 'estree';

import {
    DEFAULT_CALL_EXPRESSIONS,
    DEFAULT_FILENAME_MATCHER,
    DEFAULT_MEMBER_EXPRESSIONS,
    FILENAME_MATCHER_SCHEMA_PROPERTY,
    createFilenamePredicate,
    isCreateMessagesCall,
    type I18nCreateMessagesFilenamesOptions,
} from '../shared/create-messages-call';

type SortI18nMessageKeysOptions = I18nCreateMessagesFilenamesOptions & {
    localesOrder?: string[];
};

const DEFAULT_LOCALES_ORDER = ['ru', 'en'];

const META_KEY = 'meta';

function buildOrderMessage(localesOrder: readonly string[]): string {
    const localesPart = localesOrder.length
        ? `${localesOrder.join(', ')}, then other locales (source order)`
        : 'locales (source order)';

    return `Locale keys in i18n message objects must be ordered: ${localesPart}, then ${META_KEY}.`;
}

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

function getDesiredPropertyOrder(
    properties: Property[],
    localesOrder: readonly string[],
): Property[] {
    const buckets = new Map<string, Property[]>();

    for (const locale of localesOrder) {
        buckets.set(locale, []);
    }

    const meta: Property[] = [];
    const others: Property[] = [];

    for (const prop of properties) {
        const name = getPropertyKeyName(prop.key);
        if (name === META_KEY) {
            meta.push(prop);
            continue;
        }

        const bucket = name === null ? undefined : buckets.get(name);

        if (bucket) {
            bucket.push(prop);
        } else {
            others.push(prop);
        }
    }

    const ordered: Property[] = [];

    for (const locale of localesOrder) {
        const bucket = buckets.get(locale);

        if (bucket) {
            ordered.push(...bucket);
        }
    }

    return [...ordered, ...others, ...meta];
}

function propertiesAreInOrder(current: Property[], desired: Property[]): boolean {
    return desired.every((node, index) => node === current[index]);
}

const COMMENT_RE = /\/\/|\/\*/;

/**
 * Returns the raw text between the first two properties (preserving indentation),
 * or `null` when that text contains a comment — in which case the fixer must bail out
 * to avoid moving comments to the wrong position.
 */
function pickPropertySeparator(sourceCodeText: string, properties: Property[]): string | null {
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

    const sep = sourceCodeText.slice(start, end);

    if (COMMENT_RE.test(sep)) {
        return null;
    }

    return sep;
}

const RULE_DESCRIPTION =
    'Enforce key order in i18n message objects: configurable locales first, then other locales (source order), then meta.';

export const rule: Rule.RuleModule = {
    meta: {
        type: 'layout',
        fixable: 'code',
        docs: {
            description: RULE_DESCRIPTION,
        },
        messages: {
            wrongKeyOrder: '{{message}}',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    memberExpressions: {type: 'array'},
                    callExpressions: {type: 'array'},
                    filenameMatcher: FILENAME_MATCHER_SCHEMA_PROPERTY,
                    localesOrder: {
                        type: 'array',
                        items: {type: 'string'},
                        uniqueItems: true,
                    },
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
        const localesOrder = (options.localesOrder ?? DEFAULT_LOCALES_ORDER).filter(
            (l) => l !== META_KEY,
        );
        const matchesFilename = createFilenamePredicate(filenameMatcher);
        const messageText = buildOrderMessage(localesOrder);

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

                const desired = getDesiredPropertyOrder(properties, localesOrder);
                if (propertiesAreInOrder(properties, desired)) {
                    continue;
                }

                context.report({
                    node: value,
                    messageId: 'wrongKeyOrder',
                    data: {message: messageText},
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
                        if (sep === null) {
                            return null;
                        }
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
