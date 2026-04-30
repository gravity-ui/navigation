import type {Rule, SourceCode} from 'eslint';
import type {CallExpression, ObjectExpression, Property} from 'estree';

import {
    DEFAULT_CALL_EXPRESSIONS,
    DEFAULT_FILENAME_MATCHER,
    DEFAULT_MEMBER_EXPRESSIONS,
    defaultFilenameMatch,
    isCreateMessagesCall,
    type I18nCreateMessagesFilenamesOptions,
} from '../shared/create-messages-call';

const MESSAGE =
    'In i18n.ts createMessages definitions, meta must be written as a multiline object ({ with line breaks }), not inlined as meta: { id: ... }.';

function getIndentBeforeIndex(sourceCode: SourceCode, index: number): string {
    const text = sourceCode.text;
    const lineStart = text.lastIndexOf('\n', index - 1) + 1;
    return text.slice(lineStart, index);
}

function getSiblingIndentStep(
    sourceCode: SourceCode,
    messageOuterProp: Property,
    messageObject: ObjectExpression,
): string {
    const firstSibling = messageObject.properties.find((p) => p.type === 'Property');
    if (!firstSibling || firstSibling.range === undefined || messageOuterProp.range === undefined) {
        return '    ';
    }
    const outer = getIndentBeforeIndex(sourceCode, messageOuterProp.range[0]);
    const inner = getIndentBeforeIndex(sourceCode, firstSibling.range[0]);
    if (inner.startsWith(outer)) {
        const step = inner.slice(outer.length);
        return step.length > 0 ? step : '    ';
    }
    return '    ';
}

function isMetaPropertyKey(key: Property['key']): boolean {
    if (key.type === 'Identifier') {
        return key.name === 'meta';
    }
    if (key.type === 'Literal') {
        return key.value === 'meta';
    }
    return false;
}

function metaObjectHasUnsupportedFeatures(objectExpr: ObjectExpression): boolean {
    return objectExpr.properties.some((p) => p.type !== 'Property');
}

/** Inner text of `{…}` excludes outer braces — must contain a newline to count as multiline. */
function isInlineMetaObjectBraceBody(
    sourceCode: SourceCode,
    objectExpr: ObjectExpression,
): boolean {
    const text = sourceCode.getText(objectExpr);
    // minimal `{` … `}`
    if (!text.startsWith('{') || !text.endsWith('}')) {
        return false;
    }
    const inner = text.slice(1, -1);
    return !inner.includes('\n');
}

function formatMetaReplacement(
    sourceCode: SourceCode,
    metaObject: ObjectExpression,
    metaProp: Property,
    messageOuterProp: Property,
    messageBody: ObjectExpression,
): string {
    const props = metaObject.properties.filter((p): p is Property => p.type === 'Property');

    const baseIndent = metaProp.range ? getIndentBeforeIndex(sourceCode, metaProp.range[0]) : '';
    const step = getSiblingIndentStep(sourceCode, messageOuterProp, messageBody);
    const innerIndent = `${baseIndent}${step}`;

    if (props.length === 0) {
        return `{\n${baseIndent}}`;
    }

    const lines = props.map((p) => `${innerIndent}${sourceCode.getText(p)},`);
    return `{\n${lines.join('\n')}\n${baseIndent}}`;
}

export const rule: Rule.RuleModule = {
    meta: {
        type: 'layout',
        fixable: 'code',
        docs: {
            description: MESSAGE,
        },
        messages: {
            inlineMeta: MESSAGE,
        },
        schema: [
            {
                type: 'object',
                properties: {
                    memberExpressions: {type: 'array'},
                    callExpressions: {type: 'array'},
                    filenameMatcher: {type: 'string'},
                },
            },
        ],
    },

    create(context) {
        const options: I18nCreateMessagesFilenamesOptions = context.options[0] || {};
        const memberExpressions = options.memberExpressions ?? DEFAULT_MEMBER_EXPRESSIONS;
        const callExpressions = options.callExpressions ?? DEFAULT_CALL_EXPRESSIONS;
        const filenameMatcher = options.filenameMatcher ?? DEFAULT_FILENAME_MATCHER;

        const filename = context.getFilename();

        if (!defaultFilenameMatch(filename, filenameMatcher)) {
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

            for (const messageEntry of arg0.properties) {
                if (messageEntry.type !== 'Property') {
                    continue;
                }

                const messageBody = messageEntry.value;
                if (messageBody.type !== 'ObjectExpression') {
                    continue;
                }

                for (const field of messageBody.properties) {
                    if (field.type !== 'Property' || !isMetaPropertyKey(field.key)) {
                        continue;
                    }

                    const metaValue = field.value;
                    if (metaValue.type !== 'ObjectExpression') {
                        continue;
                    }

                    if (metaObjectHasUnsupportedFeatures(metaValue)) {
                        continue;
                    }

                    if (!isInlineMetaObjectBraceBody(sourceCode, metaValue)) {
                        continue;
                    }

                    if (metaValue.range === undefined) {
                        continue;
                    }

                    context.report({
                        node: metaValue,
                        messageId: 'inlineMeta',
                        fix(fixer) {
                            const replacement = formatMetaReplacement(
                                sourceCode,
                                metaValue,
                                field,
                                messageEntry,
                                messageBody,
                            );
                            return fixer.replaceTextRange(metaValue.range!, replacement);
                        },
                    });
                }
            }
        }

        return {
            CallExpression: visitCreateMessagesCall,
        };
    },
};
