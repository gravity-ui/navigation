# multiline-i18n-meta-object

В файлах, для которых срабатывает `filenameMatcher`, требует, чтобы объект `meta` в записях `createMessages` был записан многострочно (с переносами строк внутри фигурных скобок), а не в одну строку вида `meta: { id: '…' }`. Правило автоматически исправляет форматирование.

Объекты `meta` со spread (`meta: { ...base }`) не проверяются.

## Подключение

Пример подключения правила:

```javascript
module.exports = {
    "@gravity-ui/eslint-plugin-i18n/multiline-i18n-meta-object": ["error", {}],
};
```

## Опции

- `memberExpressions`: массив шаблонов вызова вида `{ member: 'intl', property: 'createMessages' }`. По умолчанию `[{ member: 'intl', property: 'createMessages' }]`.

- `callExpressions`: имена функций без получателя, которые считаются вызовом `createMessages`. По умолчанию `['createMessages']`.

- `filenameMatcher`: по умолчанию строка `'i18n.ts'` — см. выше. Либо объект **`{ type: 'regexp', pattern, flags? }`** для совпадения с полным нормализованным путём.

```javascript
module.exports = {
    "@gravity-ui/eslint-plugin-i18n/multiline-i18n-meta-object": [
        "error",
        {
            memberExpressions: [{member: "intl", property: "createMessages"}],
            callExpressions: ["createMessages"],
            filenameMatcher: "i18n.ts",
        },
    ],
};
```

Объект для имён вида `*.i18n.ts`:

```javascript
filenameMatcher: {
    type: "regexp",
    pattern: "\\.i18n\\.ts$",
},
```

Универсальный паттерн (и `i18n.ts`, и `something.i18n.ts`):

```javascript
filenameMatcher: {
    type: "regexp",
    pattern: "(?:\\/|^|\\.)i18n\\.ts$",
},
```

## Примеры работы правила

Пример **некорректного** кода для этого правила:

```js
// ⛔️ meta в одну строку (в i18n.ts)
intl.createMessages({
    key: {
        ru: "",
        en: "",
        meta: { id: "foo" },
    },
});
```

Пример **корректного** кода для этого правила:

```js
// ✅ meta с переносами строк внутри объекта
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
