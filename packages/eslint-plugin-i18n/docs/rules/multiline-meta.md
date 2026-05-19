# multiline-meta

In files matched by `filenameMatcher`, requires the `meta` object in `createMessages` / `declareMessages` entries to be written multiline (with line breaks inside the braces), not inlined as `meta: { id: '…' }`. The rule auto-fixes formatting.

`meta` objects with a spread (`meta: { ...base }`) are not checked.

## Setup

Example rule configuration:

```javascript
module.exports = {
    "@gravity-ui/eslint-plugin-i18n/multiline-meta": ["error", {}],
};
```

## Options

- `memberExpressions`: array of call patterns like `{ member: 'intl', property: 'createMessages' }`. Default: `[{ member: 'intl', property: 'createMessages' }, { member: 'intl', property: 'declareMessages' }]`.

- `callExpressions`: bare function names treated as message-definition calls. Default: `['createMessages', 'declareMessages']`.

- `filenameMatcher`: default string `'i18n.ts'` — see above. Alternatively, an object **`{ type: 'regexp', pattern, flags? }`** for matching against the full normalized path.

```javascript
module.exports = {
    "@gravity-ui/eslint-plugin-i18n/multiline-meta": [
        "error",
        {
            memberExpressions: [
                {member: "intl", property: "createMessages"},
                {member: "intl", property: "declareMessages"},
            ],
            callExpressions: ["createMessages", "declareMessages"],
            filenameMatcher: "i18n.ts",
        },
    ],
};
```

Object matcher for `*.i18n.ts` paths:

```javascript
filenameMatcher: {
    type: "regexp",
    pattern: "\\.i18n\\.ts$",
},
```

Universal pattern (both `i18n.ts` and `something.i18n.ts`):

```javascript
filenameMatcher: {
    type: "regexp",
    pattern: "(?:\\/|^|\\.)i18n\\.ts$",
},
```

## Examples

**Incorrect** code for this rule:

```js
// ⛔️ single-line meta (in i18n.ts)
intl.createMessages({
    key: {
        ru: "",
        en: "",
        meta: { id: "foo" },
    },
});
```

**Correct** code for this rule:

```js
// ✅ meta with line breaks inside the object
intl.createMessages({
    key: {
        ru: "",
        en: "",
        meta: {
            id: "foo",
        },
    },
});
```
