import {RuleTester} from 'eslint';

import {rule} from '../sort-i18n-message-keys';

const ruleTester = new RuleTester({languageOptions: {ecmaVersion: 2022}});

const I18N_FILE = '/project/src/widget/i18n.ts';
const OTHER_FILE = '/project/src/widget/Component.tsx';

const defaultOptions = [
    {
        memberExpressions: [{member: 'intl', property: 'createMessages'}],
        callExpressions: ['createMessages'],
    },
];

const regexpDotI18nTsOptions = [
    {
        memberExpressions: [{member: 'intl', property: 'createMessages'}],
        callExpressions: ['createMessages'],
        filenameMatcher: {type: 'regexp' as const, pattern: String.raw`\.i18n\.ts$`},
    },
];

const I18N_DOT_FILE = '/project/src/widget/strings.i18n.ts';

const enFirstOrderOptions = [
    {
        memberExpressions: [{member: 'intl', property: 'createMessages'}],
        callExpressions: ['createMessages'],
        localesOrder: ['en', 'ru'],
    },
];

const customLocaleOrderOptions = [
    {
        memberExpressions: [{member: 'intl', property: 'createMessages'}],
        callExpressions: ['createMessages'],
        localesOrder: ['en', 'kk', 'ru'],
    },
];

const emptyLocalesOrderOptions = [
    {
        memberExpressions: [{member: 'intl', property: 'createMessages'}],
        callExpressions: ['createMessages'],
        localesOrder: [],
    },
];

ruleTester.run('sort-i18n-message-keys', rule, {
    valid: [
        {
            name: 'correct order ru, en, meta',
            code: `
intl.createMessages({
    key: {
        ru: '',
        en: '',
        meta: { id: 'x', markdown: false },
    },
});
`,
            filename: I18N_FILE,
            options: defaultOptions,
        },
        {
            name: 'other locale between en and meta',
            code: `
intl.createMessages({
    key: {
        ru: '',
        en: '',
        kk: '',
        meta: {},
    },
});
`,
            filename: I18N_FILE,
            options: defaultOptions,
        },
        {
            name: 'misleading basename not-i18n.ts — ignored',
            code: `
intl.createMessages({
    key: {
        en: '',
        ru: '',
    },
});
`,
            filename: '/project/widgets/not-i18n.ts',
            options: defaultOptions,
        },
        {
            name: 'wrong order but not i18n.ts — ignored',
            code: `
intl.createMessages({
    key: {
        en: '',
        ru: '',
        meta: {},
    },
});
`,
            filename: OTHER_FILE,
            options: defaultOptions,
        },
        {
            name: 'spread in message object — skip',
            code: `
intl.createMessages({
    key: {
        ...base,
        en: '',
        ru: '',
    },
});
`,
            filename: I18N_FILE,
            options: defaultOptions,
        },
        {
            name: 'single property — skip',
            code: `
intl.createMessages({
    key: {
        ru: '',
    },
});
`,
            filename: I18N_FILE,
            options: defaultOptions,
        },
        {
            name: 'standalone createMessages call',
            code: `
createMessages({
    x: {
        ru: '',
        en: '',
    },
});
`,
            filename: I18N_FILE,
            options: defaultOptions,
        },
        {
            name: 'localesOrder [en, ru] — already in this order',
            code: `
intl.createMessages({
    key: {
        en: '',
        ru: '',
        meta: {},
    },
});
`,
            filename: I18N_FILE,
            options: enFirstOrderOptions,
        },
        {
            name: 'localesOrder [en, kk, ru] — explicit locales first, others (de) preserved',
            code: `
intl.createMessages({
    key: {
        en: '',
        kk: '',
        ru: '',
        de: '',
        meta: {},
    },
});
`,
            filename: I18N_FILE,
            options: customLocaleOrderOptions,
        },
        {
            name: 'empty localesOrder — only meta-last enforced; locales kept in source order',
            code: `
intl.createMessages({
    key: {
        de: '',
        en: '',
        ru: '',
        meta: {},
    },
});
`,
            filename: I18N_FILE,
            options: emptyLocalesOrderOptions,
        },
        {
            name: 'regexp filenameMatcher — *.i18n.ts path, correct order',
            code: `
intl.createMessages({
    key: {
        ru: '',
        en: '',
        meta: {},
    },
});
`,
            filename: I18N_DOT_FILE,
            options: regexpDotI18nTsOptions,
        },
        {
            name: 'regexp filenameMatcher — plain i18n.ts path ignored',
            code: `
intl.createMessages({
    key: {
        en: '',
        ru: '',
        meta: {},
    },
});
`,
            filename: I18N_FILE,
            options: regexpDotI18nTsOptions,
        },
    ],

    invalid: [
        {
            name: 'reorder en, ru, meta → ru, en, meta',
            code: `
intl.createMessages({
    key: {
        en: '',
        ru: '',
        meta: {},
    },
});
`,
            filename: I18N_FILE,
            options: defaultOptions,
            errors: [{messageId: 'wrongKeyOrder'}],
            output: `
intl.createMessages({
    key: {
        ru: '',
        en: '',
        meta: {},
    },
});
`,
        },
        {
            name: 'en, meta, fr → en, fr, meta',
            code: `
intl.createMessages({
    key: {
        en: 'e',
        meta: { id: '1' },
        fr: 'f',
        ru: 'r',
    },
});
`,
            filename: I18N_FILE,
            options: defaultOptions,
            errors: [{messageId: 'wrongKeyOrder'}],
            output: `
intl.createMessages({
    key: {
        ru: 'r',
        en: 'e',
        fr: 'f',
        meta: { id: '1' },
    },
});
`,
        },
        {
            name: 'preserve dangling comma inside message object',
            code: `
intl.createMessages({
    key: {
        en: '',
        ru: '',
    },
});
`,
            filename: I18N_FILE,
            options: defaultOptions,
            errors: [{messageId: 'wrongKeyOrder'}],
            output: `
intl.createMessages({
    key: {
        ru: '',
        en: '',
    },
});
`,
        },
        {
            name: 'meta stays last — inner keys untouched',
            code: `
intl.createMessages({
    key: {
        meta: {
            markdown: true,
            id: 'a',
        },
        ru: '',
        en: '',
    },
});
`,
            filename: I18N_FILE,
            options: defaultOptions,
            errors: [{messageId: 'wrongKeyOrder'}],
            output: `
intl.createMessages({
    key: {
        ru: '',
        en: '',
        meta: {
            markdown: true,
            id: 'a',
        },
    },
});
`,
        },
        {
            name: 'wrong order with inline comments between properties — error but no autofix',
            code: `
intl.createMessages({
    key: {
        en: '', // English
        ru: '', // Russian
        meta: {},
    },
});
`,
            filename: I18N_FILE,
            options: defaultOptions,
            errors: [{messageId: 'wrongKeyOrder'}],
            output: null,
        },
        {
            name: 'localesOrder [en, ru] — reorder ru, en, meta → en, ru, meta',
            code: `
intl.createMessages({
    key: {
        ru: 'r',
        en: 'e',
        meta: {},
    },
});
`,
            filename: I18N_FILE,
            options: enFirstOrderOptions,
            errors: [{messageId: 'wrongKeyOrder'}],
            output: `
intl.createMessages({
    key: {
        en: 'e',
        ru: 'r',
        meta: {},
    },
});
`,
        },
        {
            name: 'localesOrder [en, kk, ru] — explicit locales first, others stay in source order',
            code: `
intl.createMessages({
    key: {
        de: 'd',
        ru: 'r',
        kk: 'k',
        en: 'e',
        meta: {},
    },
});
`,
            filename: I18N_FILE,
            options: customLocaleOrderOptions,
            errors: [{messageId: 'wrongKeyOrder'}],
            output: `
intl.createMessages({
    key: {
        en: 'e',
        kk: 'k',
        ru: 'r',
        de: 'd',
        meta: {},
    },
});
`,
        },
        {
            name: 'empty localesOrder — only forces meta to last',
            code: `
intl.createMessages({
    key: {
        ru: 'r',
        meta: {},
        en: 'e',
    },
});
`,
            filename: I18N_FILE,
            options: emptyLocalesOrderOptions,
            errors: [{messageId: 'wrongKeyOrder'}],
            output: `
intl.createMessages({
    key: {
        ru: 'r',
        en: 'e',
        meta: {},
    },
});
`,
        },
        {
            name: 'regexp filenameMatcher — reorder on *.i18n.ts file',
            code: `
intl.createMessages({
    key: {
        en: '',
        ru: '',
        meta: {},
    },
});
`,
            filename: I18N_DOT_FILE,
            options: regexpDotI18nTsOptions,
            errors: [{messageId: 'wrongKeyOrder'}],
            output: `
intl.createMessages({
    key: {
        ru: '',
        en: '',
        meta: {},
    },
});
`,
        },
    ],
});
