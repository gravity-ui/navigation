# sort-message-locales

In files matched by `filenameMatcher`, enforces property order in message objects inside `createMessages` / `declareMessages`: locales listed in `localesOrder` first (default `['ru', 'en']`), then any other locales (preserving their source order), then `meta`. The rule auto-fixes property order.

Message objects that contain a spread (`...`) are skipped. Objects with a single property are also skipped.

## Setup

Example rule configuration:

```javascript
module.exports = {
    "@gravity-ui/eslint-plugin-i18n/sort-message-locales": ["error", {}],
};
```

## Options

- `memberExpressions`: array of call patterns like `{ member: 'intl', property: 'createMessages' }`. Default: `[{ member: 'intl', property: 'createMessages' }, { member: 'intl', property: 'declareMessages' }]`.

- `callExpressions`: bare function names treated as message-definition calls. Default: `['createMessages', 'declareMessages']`.

- `localesOrder`: array of locale names in the desired order. Default: `['ru', 'en']`. Locales not listed here are placed after the ordered ones, in their original source order. `meta` is always last and is ignored if included in this array.

- `filenameMatcher`: default string `'i18n.ts'` — matches when the normalized path (with `/` separators) ends with `/${filenameMatcher}` or equals `filenameMatcher`. Alternatively, an object **`{ type: 'regexp', pattern: string, flags?: string }`** — matches against the full normalized path. Example for `*.i18n.ts` only: `pattern: '\\.i18n\\.ts$'` (plain `i18n.ts` won't match; see string suffix or pattern below for both cases).

```javascript
module.exports = {
    "@gravity-ui/eslint-plugin-i18n/sort-message-locales": [
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

Object matcher for paths ending in `.i18n.ts`:

```javascript
filenameMatcher: {
    type: "regexp",
    pattern: "\\.i18n\\.ts$",
},
```

Universal pattern for both `i18n.ts` and `something.i18n.ts`:

```javascript
filenameMatcher: {
    type: "regexp",
    pattern: "(?:\\/|^|\\.)i18n\\.ts$",
},
```

Example with a custom locale order:

```javascript
module.exports = {
    "@gravity-ui/eslint-plugin-i18n/sort-message-locales": [
        "error",
        {
            localesOrder: ["en", "ru"],
        },
    ],
};
```

## Examples

**Incorrect** code for this rule:

```js
// ⛔️ en before ru (in i18n.ts)
intl.createMessages({
    key: {
        en: "",
        ru: "",
        meta: {},
    },
});
```

**Correct** code for this rule:

```js
// ✅ ru, en, then other locales in source order, then meta
intl.createMessages({
    key: {
        ru: "",
        en: "",
        kk: "",
        meta: {},
    },
});
```
