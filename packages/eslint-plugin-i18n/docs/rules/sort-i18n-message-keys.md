# sort-i18n-message-keys

В файлах `i18n.ts` проверяет порядок полей в объектах сообщений внутри `createMessages`: сначала `ru`, затем `en`, затем остальные локали (в том порядке, в каком они были в исходном коде), затем `meta`. Правило автоматически переупорядочивает свойства.

Если в объекте сообщения есть spread (`...`), правило такой объект пропускает. Объекты с одним свойством тоже не трогаются.

## Подключение

Пример подключения правила:

```javascript
module.exports = {
    "@gravity-ui/eslint-plugin-i18n/sort-i18n-message-keys": ["error", {}],
};
```

## Опции

- `memberExpressions`: массив шаблонов вызова вида `{ member: 'intl', property: 'createMessages' }`. По умолчанию `[{ member: 'intl', property: 'createMessages' }]`.

- `callExpressions`: имена функций без получателя, которые считаются вызовом `createMessages`. По умолчанию `['createMessages']`.

- `filenameMatcher`: суффикс пути файла, при котором правило срабатывает. По умолчанию `'i18n.ts'`.

```javascript
module.exports = {
    "@gravity-ui/eslint-plugin-i18n/sort-i18n-message-keys": [
        "error",
        {
            memberExpressions: [{member: "intl", property: "createMessages"}],
            callExpressions: ["createMessages"],
            filenameMatcher: "i18n.ts",
        },
    ],
};
```

## Примеры работы правила

Пример **некорректного** кода для этого правила:

```js
// ⛔️ en перед ru (в i18n.ts)
intl.createMessages({
    key: {
        en: "",
        ru: "",
        meta: {},
    },
});
```

Пример **корректного** кода для этого правила:

```js
// ✅ ru, en, затем прочие локали по исходному порядку, затем meta
intl.createMessages({
    key: {
        ru: "",
        en: "",
        kk: "",
        meta: {},
    },
});
```
