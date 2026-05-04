# @gravity-ui/eslint-plugin-i18n

Rules for i18n linting.

## How to connect to a project

1. Install the package:

   ```sh
   npm i --save-dev @gravity-ui/eslint-plugin-i18n
   ```

2. Connect the plugin and rules to the eslint config.

   Add to the client config (`src/ui/.eslintrc`):

   ```js
   {
       "plugins": ["@gravity-ui/eslint-plugin-i18n"],
       "rules": {
           "@gravity-ui/i18n/detect-incorrect-calls": "error",
           "@gravity-ui/i18n/auto-generate-translation-message-id": "error"
       }
   }
   ```

## Rules

| Name                                                                                       | Description                                                                                                                            |
| :----------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| [restrict-i18n-imports](docs/rules/restrict-i18n-imports.md)                               | Prohibits importing text files (`i18n.ts`) from directories of other levels.                                                           |
| [auto-generate-translation-message-id](docs/rules/auto-generate-translation-message-id.md) | Checks for the presence of an identifier in the translation object and adds it if missing                                              |
| [multiline-i18n-meta-object](docs/rules/multiline-i18n-meta-object.md)                     | In `i18n.ts`, requires `meta` in `createMessages` entries to be multiline objects (with line breaks), not single-line `meta: { ... }`. |
| [sort-i18n-message-keys](docs/rules/sort-i18n-message-keys.md)                             | Enforces key order in message objects: `ru`, `en`, then other locales (source order), then `meta`.                                     |
