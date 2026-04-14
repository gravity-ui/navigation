# i18n-core

The **i18n-core** library is the foundation for internationalization (i18n) libraries. Built on top of **[@formatjs/intl](https://formatjs.github.io/)**.

## Key Features:
1. **Framework Agnostic**:
   Designed to work with any JavaScript or TypeScript project, React-based or not.

1. **Built on top of @formatjs/intl**:
   Leverages the powerful formatting and customization capabilities of @formatjs/intl, providing industry-standard localization functionality.

1. **Modular and Extensible**:
   The architecture allows for extending or customizing functionality according to your project's requirements.

## Usage Examples:
- **React applications**: easily integrates with React projects using the [i18n-react](../i18n-react/README.md) library.
- **Server-side solutions**: easily integrates with server-side solutions using the [i18n-node](../i18n-node/README.md) library.

## Usage

### Locale Fallbacks

#### Configuration:

- `fallbackLocales` - fallbacks for defined locales.
- `defaultFallback` - default fallback. It will be used if no higher priority fallback is found. Available options:
    - `empty-string` - fallback to empty string.
    - `key` - fallback to translation key.
    - One of the locales used in the project `allowedLocales`, or their list.
- For `defaultFallback` `empty-string` or `key`, the same behavior applies when a **key is missing from the keyset** passed to `createMessages` (there is no entry for that key at all). If `defaultFallback` is a locale or a list of locales, a missing key still cannot be resolved and results in a missing-translation error, same as when a key exists but has no string in any fallback locale.
- `disableUseLocaleLangAsFallback` - disable using locale language as its fallback. More details can be found in the fallback search section.

#### Fallback Search:

Fallbacks for `locale='ru-kz'`:
1. Use `fallbackLocales['ru-kz']`, if present
1. If `disableUseLocaleLangAsFallback === false`:
    - Detect locale using [Intl.Locale](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale). In our case `Intl.Locale('ru-kz').language === 'ru'`
    - Use `allowedLocales[Intl.Locale('ru-kz').language]`, if present
    - Use fallback for `Intl.Locale('ru-kz').language`. For search, use this same algorithm from the beginning.
1. Use `defaultFallback`

#### Example:

{% list tabs %}
- Using `fallbackLocales` and `defaultFallback`

   i18n instance config:
   ```typescript
   {
      allowedLocales: ['en', 'ru', 'ru-kz'],
      fallbackLocales: {
         'ru-kz': 'ru',
         'ru': 'en'
      },
      defaultFallback: 'empty-string'
   }
   ```

   Fallbacks by languages:
   - `en` - empty string
   - `ru` - `en`, empty string
   - `ru-kz` - `ru`, `en`, empty string

- Using locale language as fallback

   Internationalization instance configuration:
   ```typescript
   {
      allowedLocales: ['en', 'ru', 'ru-kz'],
      fallbackLocales: {},
      defaultFallback: 'empty-string',
      disableUseLocaleLangAsFallback: false
   }
   ```

   Fallbacks by languages:
   - `en`, `ru` - empty string
   - `ru-kz` - `ru`, empty string

{% endlist %}

