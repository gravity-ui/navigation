import {RuleTester} from 'eslint';
import shortUuid, {SUUID} from 'short-uuid';

import {rule} from '../auto-generate-translation-message-id';
import {TRANSLATION_OBJECT_KEY_AND_UUID_SEPARATOR} from '../auto-generate-translation-message-id/constants';
import {RuleOptions} from '../auto-generate-translation-message-id/types';

const uuidMocked: SUUID = '5251Zqy4Tirk6yhwzvmkpy' as SUUID;
const UUID = uuidMocked.slice(0, 5);

jest.mock('short-uuid');

jest.mocked(shortUuid.generate).mockReturnValue(uuidMocked);

const ruleTester = new RuleTester({});

const filename = 'src/ui/units/audit-trails/components/Trail/Trail.tsx';

const runTests = (
    validCases: RuleTester.ValidTestCase[],
    invalidCases: RuleTester.InvalidTestCase[],
) => {
    ruleTester.run('', rule, {
        valid: validCases,
        invalid: invalidCases,
    });
};

describe('Rule auto-generate-translation-message-id', () => {
    describe('without namespace', () => {
        const options: Partial<RuleOptions>[] = [
            {
                memberExpressions: [{member: 'intl', property: 'createMessages'}],
            },
        ];

        describe('should not change existing id', () => {
            const validCases = [
                {
                    name: 'member expression',
                    code: `intl.createMessages({
                        create: {
                            en: 'Create',
                            meta: {
                                id: 'id-value',
                            }
                        }
                    })`,
                    options,
                },
            ];

            runTests(validCases, []);
        });

        describe(`should add meta with generated uuid if id does't exist`, () => {
            const invalidCases = [
                {
                    name: 'member expression',
                    code: `intl.createMessages({
                        create: {
                            en: 'Create',
                        }
                    })`,
                    options,
                    errors: [{message: 'Expression should have id property'}],
                    output: `intl.createMessages({
                        create: {meta:{id:'create${TRANSLATION_OBJECT_KEY_AND_UUID_SEPARATOR}${UUID}'},
                            en: 'Create',
                        }
                    })`,
                },
            ];

            runTests([], invalidCases);
        });

        describe(`should add meta with generated uuid if id does't exist with plural translation`, () => {
            const invalidCases = [
                {
                    name: 'member expression',
                    code: `intl.createMessages({
                        create: {
                            en: {zero: 'zero'},
                        }
                    })`,
                    options,
                    errors: [{message: 'Expression should have id property'}],
                    output: `intl.createMessages({
                        create: {meta:{id:'create${TRANSLATION_OBJECT_KEY_AND_UUID_SEPARATOR}${UUID}'},
                            en: {zero: 'zero'},
                        }
                    })`,
                },
            ];

            runTests([], invalidCases);
        });

        describe(`should add generated uuid if id does't exist`, () => {
            const invalidCases = [
                {
                    name: 'member expression',
                    code: `intl.createMessages({
                        create: {
                            meta: {description: "text"},
                            en: 'Create',
                        }
                    })`,
                    options,
                    errors: [{message: 'Expression should have id property'}],
                    output: `intl.createMessages({
                        create: {
                            meta: {id:'create${TRANSLATION_OBJECT_KEY_AND_UUID_SEPARATOR}${UUID}',description: "text"},
                            en: 'Create',
                        }
                    })`,
                },
            ];

            runTests([], invalidCases);
        });

        describe(`should add generated uuid if parameter - empty object`, () => {
            const invalidCases = [
                {
                    name: 'member expression',
                    code: `intl.createMessages({
                        create: {}
                    })`,
                    options,
                    errors: [{message: 'Expression should have id property'}],
                    output: `intl.createMessages({
                        create: {meta:{id:'create${TRANSLATION_OBJECT_KEY_AND_UUID_SEPARATOR}${UUID}'},}
                    })`,
                },
            ];

            runTests([], invalidCases);
        });

        describe(`should not add generated uuid if maxValidLength is less than uuid`, () => {
            const testOptions: Partial<RuleOptions>[] = [{...options[0], maxValidLength: 1}];
            const invalidCases = [
                {
                    name: 'member expression',
                    code: `intl.createMessages({
                        create: {
                            en: 'Create',
                        }
                    })`,
                    options: testOptions,
                    errors: [
                        {
                            message:
                                "Can't generate message id because it exceeds the maximum valid length of 1 characters. Please change the regular expression in namespaceMatchers used for id generation, update the generateId function",
                        },
                    ],
                    output: null,
                },
            ];

            runTests([], invalidCases);
        });
    });

    describe('with namespace', () => {
        const options: Partial<RuleOptions>[] = [
            {
                memberExpressions: [{member: 'intl', property: 'createMessages'}],
                namespaceMatchers: [
                    // src/ui/units/*/components/*
                    /src\/ui\/units\/([^/]+)\/components\/([^/]+)/,
                    /src\/ui\/units\/([^/]+)\/pages\/([^/]+)/,
                ],
                invalidCharsReplacement: '_',
            },
        ];

        describe('should not change not valid namespace', () => {
            const validCases = [
                {
                    name: 'member expression',
                    code: `intl.createMessages({
                        create: {
                            meta: {id: 'dc62395d-1637-4aee-9ac6-3a6d7a5983b2'},
                            en: 'Create',
                        }
                    })`,
                    filename,
                    options,
                },
            ];

            runTests(validCases, []);
        });

        describe('should add id with namespace', () => {
            const invalidCases = [
                {
                    name: 'member expression',
                    code: `intl.createMessages({
                        create: {
                            en: 'Create',
                        }
                    })`,
                    filename,
                    options,
                    errors: [{message: 'Expression should have id property'}],
                    output: `intl.createMessages({
                        create: {meta:{id:'audit-trails.Trail.create${TRANSLATION_OBJECT_KEY_AND_UUID_SEPARATOR}${UUID}'},
                            en: 'Create',
                        }
                    })`,
                },
            ];

            runTests([], invalidCases);
        });

        describe('should add id with namespace of kebab-case key', () => {
            const invalidCases = [
                {
                    name: 'member expression',
                    code: `intl.createMessages({
                        'kebab-case': {
                            en: 'kebab-case',
                        }
                    })`,
                    filename,
                    options,
                    errors: [{message: 'Expression should have id property'}],
                    output: `intl.createMessages({
                        'kebab-case': {meta:{id:'audit-trails.Trail.kebab-case${TRANSLATION_OBJECT_KEY_AND_UUID_SEPARATOR}${UUID}'},
                            en: 'kebab-case',
                        }
                    })`,
                },
            ];

            runTests([], invalidCases);
        });

        describe('should add id without namespace if it is not matched', () => {
            const invalidCases = [
                {
                    name: 'member expression',
                    code: `intl.createMessages({
                        create: {}
                    })`,
                    filename: 'path/with/not/match',
                    options,
                    errors: [{message: 'Expression should have id property'}],
                    output: `intl.createMessages({
                        create: {meta:{id:'create${TRANSLATION_OBJECT_KEY_AND_UUID_SEPARATOR}${UUID}'},}
                    })`,
                },
            ];

            runTests([], invalidCases);
        });

        describe('should use first match for generation namespace', () => {
            const testOptions: Partial<RuleOptions>[] = [
                {
                    ...options[0],
                    namespaceMatchers: [
                        // src/ui/units/*/components/*
                        /src\/ui\/units\/([^/]+)\/components\/([^/]+)/,
                        // src/ui/units/*/components/test/*
                        /src\/ui\/units\/([^/]+)\/components\/test\/([^/]+)/,
                    ],
                },
            ];

            const invalidCases = [
                {
                    name: 'member expression',
                    code: `intl.createMessages({
                        create: {}
                    })`,
                    filename,
                    options: testOptions,
                    errors: [{message: 'Expression should have id property'}],
                    output: `intl.createMessages({
                        create: {meta:{id:'audit-trails.Trail.create${TRANSLATION_OBJECT_KEY_AND_UUID_SEPARATOR}${UUID}'},}
                    })`,
                },
            ];

            runTests([], invalidCases);
        });

        describe(`should add generated id with replaced invalid chars based on invalidCharsPattern with invalidCharsReplacement`, () => {
            const invalidCases = [
                {
                    name: 'member expression',
                    code: `intl.createMessages({
                        create: {}
                    })`,
                    filename: 'src/ui/units/audit-trails/pages/[pageId]/TrailPage.tsx',
                    options,
                    errors: [{message: 'Expression should have id property'}],
                    output: `intl.createMessages({
                        create: {meta:{id:'audit-trails._pageId_.create${TRANSLATION_OBJECT_KEY_AND_UUID_SEPARATOR}${UUID}'},}
                    })`,
                },
            ];

            runTests([], invalidCases);
        });

        // Skipped: ESLint 9 requires rule options to be serializable, functions cannot be cloned
        // describe(`should add generated id with replaced invalid chars based on invalidCharsPattern using invalidCharsReplacer function`, () => {
        //     const testOptions: Partial<RuleOptions>[] = [
        //         {
        //             ...options[0],
        //             invalidCharsReplacer: () => '-',
        //         },
        //     ];
        //
        //     const invalidCases = [
        //         {
        //             name: 'member expression',
        //             code: `intl.createMessages({
        //                 create: {}
        //             })`,
        //             filename: 'src/ui/units/audit-trails/pages/[pageId]/TrailPage.tsx',
        //             options: testOptions,
        //             errors: [{message: 'Expression should have id property'}],
        //             output: `intl.createMessages({
        //                 create: {meta:{id:'audit-trails.-pageId-.create${TRANSLATION_OBJECT_KEY_AND_UUID_SEPARATOR}${UUID}'},}
        //             })`,
        //         },
        //     ];
        //
        //     runTests([], invalidCases);
        // });
    });

    describe('validation of existing IDs', () => {
        const options: Partial<RuleOptions>[] = [
            {
                memberExpressions: [{member: 'intl', property: 'createMessages'}],
                namespaceMatchers: [/\/([^/]+)\/[^/]*i18n\.ts$/],
                validateId: true, // Enable validation for these tests
            },
        ];

        describe('should not validate by default (validateId not specified)', () => {
            const defaultOptions: Partial<RuleOptions>[] = [
                {
                    memberExpressions: [{member: 'intl', property: 'createMessages'}],
                    namespaceMatchers: [/\/([^/]+)\/[^/]*i18n\.ts$/],
                    // validateId not specified - should default to false
                },
            ];

            const validCases = [
                {
                    name: 'wrong namespace but validation disabled by default',
                    code: `intl.createMessages({
                        field_description: {
                            en: 'Description',
                            meta: {
                                id: 'agent.field_description:9ntzU',
                            }
                        }
                    })`,
                    filename: '/src/ui/modules/issue/i18n.ts',
                    options: defaultOptions,
                },
            ];

            runTests(validCases, []);
        });

        describe('should detect invalid namespace prefix', () => {
            const invalidCases = [
                {
                    name: 'wrong namespace in id',
                    code: `intl.createMessages({
                        field_description: {
                            en: 'Description',
                            meta: {
                                id: 'agent.field_description:9ntzU',
                            }
                        }
                    })`,
                    filename: '/src/ui/modules/issue/i18n.ts',
                    options,
                    errors: [
                        {
                            message:
                                'Invalid namespace "agent" in ID. Expected "issue" based on file path "/src/ui/modules/issue/i18n.ts"',
                        },
                    ],
                    output: `intl.createMessages({
                        field_description: {
                            en: 'Description',
                            meta: {
                                id: 'issue.field_description${TRANSLATION_OBJECT_KEY_AND_UUID_SEPARATOR}${UUID}',
                            }
                        }
                    })`,
                },
            ];

            runTests([], invalidCases);
        });

        describe('should detect invalid key in id', () => {
            const invalidCases = [
                {
                    name: 'key mismatch',
                    code: `intl.createMessages({
                        field_description: {
                            en: 'Description',
                            meta: {
                                id: 'issue.field_title:9ntzU',
                            }
                        }
                    })`,
                    filename: '/src/ui/modules/issue/i18n.ts',
                    options,
                    errors: [
                        {
                            message:
                                'Invalid key "field_title" in ID. Expected "field_description" to match translation key "field_description"',
                        },
                    ],
                    output: `intl.createMessages({
                        field_description: {
                            en: 'Description',
                            meta: {
                                id: 'issue.field_description${TRANSLATION_OBJECT_KEY_AND_UUID_SEPARATOR}${UUID}',
                            }
                        }
                    })`,
                },
            ];

            runTests([], invalidCases);
        });

        describe('should detect invalid ID format', () => {
            const invalidCases = [
                {
                    name: 'malformed id',
                    code: `intl.createMessages({
                        field_description: {
                            en: 'Description',
                            meta: {
                                id: 'invalid-format',
                            }
                        }
                    })`,
                    filename: '/src/ui/modules/issue/i18n.ts',
                    options,
                    errors: [
                        {
                            message:
                                'Invalid ID format "invalid-format". Expected format: namespace.key:uuid',
                        },
                    ],
                    output: `intl.createMessages({
                        field_description: {
                            en: 'Description',
                            meta: {
                                id: 'issue.field_description${TRANSLATION_OBJECT_KEY_AND_UUID_SEPARATOR}${UUID}',
                            }
                        }
                    })`,
                },
            ];

            runTests([], invalidCases);
        });

        describe('should replace existing id value, not add duplicate', () => {
            const invalidCases = [
                {
                    name: 'copied key with wrong id',
                    code: `intl.createMessages({
                        'action_close-issue': {
                            en: 'Close issue',
                            meta: {
                                id: 'issue.action_close-issue:xd1Kb',
                            }
                        },
                        'action_close-issue3': {
                            en: 'Close issue',
                            meta: {
                                id: 'issue.action_close-issue:xd1Kb',
                            }
                        }
                    })`,
                    filename: '/src/ui/modules/issue/i18n.ts',
                    options,
                    errors: [
                        {
                            message:
                                'Invalid key "action_close-issue" in ID. Expected "action_close-issue3" to match translation key "action_close-issue3"',
                        },
                    ],
                    output: `intl.createMessages({
                        'action_close-issue': {
                            en: 'Close issue',
                            meta: {
                                id: 'issue.action_close-issue:xd1Kb',
                            }
                        },
                        'action_close-issue3': {
                            en: 'Close issue',
                            meta: {
                                id: 'issue.action_close-issue3${TRANSLATION_OBJECT_KEY_AND_UUID_SEPARATOR}${UUID}',
                            }
                        }
                    })`,
                },
            ];

            runTests([], invalidCases);
        });

        describe('should not error on valid IDs', () => {
            const validCases = [
                {
                    name: 'correct namespace and key',
                    code: `intl.createMessages({
                        field_description: {
                            en: 'Description',
                            meta: {
                                id: 'issue.field_description:9ntzU',
                            }
                        }
                    })`,
                    filename: '/src/ui/modules/issue/i18n.ts',
                    options,
                },
            ];

            runTests(validCases, []);
        });

        describe('should handle kebab-case keys with underscores in IDs', () => {
            const validCases = [
                {
                    name: 'kebab-case key with underscore in id',
                    code: `intl.createMessages({
                        'action_close-issue': {
                            en: 'Close issue',
                            meta: {
                                id: 'issue.action_close-issue:xd1Kb',
                            }
                        }
                    })`,
                    filename: '/src/ui/modules/issue/i18n.ts',
                    options,
                },
            ];

            runTests(validCases, []);
        });

        describe('with validateId disabled', () => {
            const testOptions: Partial<RuleOptions>[] = [
                {
                    memberExpressions: [{member: 'intl', property: 'createMessages'}],
                    namespaceMatchers: [/\/([^/]+)\/[^/]*i18n\.ts$/],
                    validateId: false,
                },
            ];

            describe('should allow wrong namespace and key when validation disabled', () => {
                const validCases = [
                    {
                        name: 'wrong namespace and key but validation disabled',
                        code: `intl.createMessages({
                            field_description: {
                                en: 'Description',
                                meta: {
                                    id: 'agent.field_title:9ntzU',
                                }
                            }
                        })`,
                        filename: '/src/ui/modules/issue/i18n.ts',
                        options: testOptions,
                    },
                ];

                runTests(validCases, []);
            });

            describe('should still add missing IDs when validation disabled', () => {
                const invalidCases = [
                    {
                        name: 'missing id, validation disabled',
                        code: `intl.createMessages({
                            field_description: {
                                en: 'Description',
                            }
                        })`,
                        filename: '/src/ui/modules/issue/i18n.ts',
                        options: testOptions,
                        errors: [{message: 'Expression should have id property'}],
                        output: `intl.createMessages({
                            field_description: {meta:{id:'issue.field_description${TRANSLATION_OBJECT_KEY_AND_UUID_SEPARATOR}${UUID}'},
                                en: 'Description',
                            }
                        })`,
                    },
                ];

                runTests([], invalidCases);
            });
        });
    });

    // Skipped: ESLint 9 requires rule options to be serializable, functions cannot be cloned
    // describe('with generateId function', () => {
    //     const generatedIdMock = 'generated';
    //     const options: Partial<RuleOptions>[] = [
    //         {
    //             memberExpressions: [{member: 'intl', property: 'createMessages'}],
    //             generateId() {
    //                 return generatedIdMock;
    //             },
    //         },
    //     ];
    //
    //     describe('should not change generated id', () => {
    //         const validCases = [
    //             {
    //                 name: 'member expression',
    //                 code: `intl.createMessages({
    //                     create: {
    //                         meta: {id: ${generatedIdMock}}
    //                     }
    //                 })`,
    //                 options,
    //             },
    //         ];
    //
    //         runTests(validCases, []);
    //     });
    //
    //     describe('should not change generated id event if it was changed', () => {
    //         const validCases = [
    //             {
    //                 name: 'member expression',
    //                 code: `intl.createMessages({
    //                     create: {
    //                         meta: {id: 'custom-id'}
    //                     }
    //                 })`,
    //                 options,
    //             },
    //         ];
    //
    //         runTests(validCases, []);
    //     });
    //
    //     describe('should add generated id', () => {
    //         const invalidCases = [
    //             {
    //                 name: 'member expression',
    //                 code: `intl.createMessages({
    //                     create: {}
    //                 })`,
    //                 errors: [
    //                     {
    //                         message: `Expression should have id property`,
    //                     },
    //                 ],
    //                 output: `intl.createMessages({
    //                     create: {meta:{id:'${generatedIdMock}'},}
    //                 })`,
    //                 filename,
    //                 options,
    //             },
    //         ];
    //
    //         runTests([], invalidCases);
    //     });
    // });
});
