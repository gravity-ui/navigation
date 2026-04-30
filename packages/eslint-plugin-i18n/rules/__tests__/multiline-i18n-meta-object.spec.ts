import {RuleTester} from 'eslint';

import {rule} from '../multiline-i18n-meta-object';

const ruleTester = new RuleTester({languageOptions: {ecmaVersion: 2022}});

const I18N_FILE = '/project/src/widget/i18n.ts';
const OTHER_FILE = '/project/src/widget/Component.tsx';

const defaultOptions = [
    {
        memberExpressions: [{member: 'intl', property: 'createMessages'}],
        callExpressions: ['createMessages'],
    },
];

ruleTester.run('multiline-i18n-meta-object', rule, {
    valid: [
        {
            name: 'multiline meta already',
            code: `
intl.createMessages({
    key: {
        ru: '',
        en: '',
        meta: {
            id: 'x',
        },
    },
});
`,
            filename: I18N_FILE,
            options: defaultOptions,
        },
        {
            name: 'meta with spread — not validated',
            code: `
intl.createMessages({
    key: {
        ru: '',
        en: '',
        meta: { ...base },
    },
});
`,
            filename: I18N_FILE,
            options: defaultOptions,
        },
        {
            name: 'inline meta on non-i18n file — ignored',
            code: `
intl.createMessages({
    key: {
        ru: '',
        en: '',
        meta: { id: 'x' },
    },
});
`,
            filename: OTHER_FILE,
            options: defaultOptions,
        },
    ],

    invalid: [
        {
            name: 'inline meta object — fix to multiline',
            code: `
intl.createMessages({
    key: {
        ru: '',
        en: '',
        meta: { id: 'foo' },
    },
});
`,
            filename: I18N_FILE,
            options: defaultOptions,
            errors: [{messageId: 'inlineMeta'}],
            output: `
intl.createMessages({
    key: {
        ru: '',
        en: '',
        meta: {
            id: 'foo',
        },
    },
});
`,
        },
        {
            name: 'tight inline meta',
            code: `
intl.createMessages({
    key: {
        ru: '',
        en: '',
        meta: {id:'foo'},
    },
});
`,
            filename: I18N_FILE,
            options: defaultOptions,
            errors: [{messageId: 'inlineMeta'}],
            output: `
intl.createMessages({
    key: {
        ru: '',
        en: '',
        meta: {
            id:'foo',
        },
    },
});
`,
        },
        {
            name: 'inline empty meta',
            code: `
intl.createMessages({
    key: {
        ru: '',
        en: '',
        meta: {},
    },
});
`,
            filename: I18N_FILE,
            options: defaultOptions,
            errors: [{messageId: 'inlineMeta'}],
            output: `
intl.createMessages({
    key: {
        ru: '',
        en: '',
        meta: {
        },
    },
});
`,
        },
        {
            name: 'two keys inline — order preserved',
            code: `
intl.createMessages({
    key: {
        ru: '',
        en: '',
        meta: { id: 'a', markdown: true },
    },
});
`,
            filename: I18N_FILE,
            options: defaultOptions,
            errors: [{messageId: 'inlineMeta'}],
            output: `
intl.createMessages({
    key: {
        ru: '',
        en: '',
        meta: {
            id: 'a',
            markdown: true,
        },
    },
});
`,
        },
    ],
});
