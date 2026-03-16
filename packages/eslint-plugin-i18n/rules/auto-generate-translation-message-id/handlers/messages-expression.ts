import {Rule} from 'eslint';
import {CallExpression, Identifier, Literal, MemberExpression} from 'estree-jsx';

import {getLiteralString} from '../ast-helpers';
import {BaseRuleOptions} from '../types';
import {BaseHandler} from '../types/handlers';
import {checkId} from '../utils/check-id';
import {clearSpaceCharacters} from '../utils/clear-space-characters';
import {getObjectProperty} from '../utils/get-object-property';

type GetMessagesExpressionProps = BaseHandler &
    BaseRuleOptions & {
        memberExpressions: Array<{member: string; property: string}>;
        callExpressions: string[];
    };

type CallExpressionNode = CallExpression & Rule.NodeParentExtension;
type MemberExpressionNode = MemberExpression & Rule.NodeParentExtension;

const OBJECT_REGEXP = /\{[^}]*\}/;

export const getMessagesExpression = ({
    context,
    idName,
    memberExpressions,
    callExpressions,
    ...rest
}: GetMessagesExpressionProps) => {
    const sourceCode = context.getSourceCode();

    return (node: CallExpressionNode | MemberExpressionNode) => {
        let messages;

        if (node.type === 'CallExpression') {
            // Standalone call: declareMessages({...})
            if (node.callee.type !== 'Identifier') {
                return;
            }

            const calleeName = clearSpaceCharacters(sourceCode.getText(node.callee));

            if (!callExpressions.includes(calleeName)) {
                return;
            }

            messages = node.arguments?.[0];
        } else if (node.type === 'MemberExpression') {
            // Member expression: intl.createMessages({...})
            if (!node.object || !node.property || node.parent?.type !== 'CallExpression') {
                return;
            }

            const memberText = clearSpaceCharacters(sourceCode.getText(node.object));

            if (
                !memberExpressions.some(({member, property}) => {
                    if (memberText !== member) {
                        return false;
                    }

                    const propertyText = clearSpaceCharacters(sourceCode.getText(node.property));

                    return propertyText === property;
                })
            ) {
                return;
            }

            messages = node.parent.arguments?.[0];
        } else {
            return;
        }

        if (!messages || messages.type !== 'ObjectExpression') {
            return;
        }

        messages.properties.forEach((translation) => {
            if (translation.type !== 'Property') {
                return;
            }

            const argumentSource = translation ? sourceCode.getText(translation) : '{}';
            const isArgumentObject = argumentSource.match(OBJECT_REGEXP);

            const getTranslationObjectKey = () => {
                const name = (translation.key as Identifier).name;
                if (typeof name === 'string') {
                    return name;
                }

                const value = (translation.key as Literal).value;
                if (typeof value === 'string') {
                    return value;
                }

                return undefined;
            };

            const translationObjectKey = getTranslationObjectKey();

            const metaProperty = getObjectProperty({
                argument: translation.value,
                propertyName: 'meta',
            });

            const idProperty = getObjectProperty({
                argument: metaProperty?.value,
                propertyName: idName,
            });
            const hasId = Boolean(idProperty);
            const currentIdValue = getLiteralString(idProperty?.value);

            checkId({
                ...rest,
                context,

                reportLackId({context, node, id, message}) {
                    if (translation && !isArgumentObject) {
                        return;
                    }

                    const reportMessage = message || `Expression should have ${idName} property`;

                    context.report({
                        node,
                        message: reportMessage,
                        fix(fixer) {
                            if (!translation) {
                                return null;
                            }

                            if (!metaProperty) {
                                return fixer.replaceText(
                                    translation,
                                    `${argumentSource.replace('{', `{meta:{${idName}:'${id}'},`)}`,
                                );
                            }

                            // Re-check for id property in case it was added by another fix
                            const currentIdProperty = getObjectProperty({
                                argument: metaProperty?.value,
                                propertyName: idName,
                            });

                            // If there's an existing id property, replace its value
                            if (currentIdProperty) {
                                return fixer.replaceText(currentIdProperty.value, `'${id}'`);
                            }

                            // Otherwise add the id property to the meta object
                            return fixer.replaceText(
                                metaProperty,
                                `${sourceCode.getText(metaProperty).replace('{', `{${idName}:'${id}',`)}`,
                            );
                        },
                    });
                },
                hasId,
                currentIdValue,
                node,
                translationObjectKey,
            });
        });
    };
};
