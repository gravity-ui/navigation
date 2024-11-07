<!--GITHUB_BLOCK-->

## HotkeysPanel

<!--/GITHUB_BLOCK-->

`HotkeysPanel` — это панель навигации для справки по горячим клавишам.
Панель содержит набор горячих клавиш с их назначением для работы в приложении.

```ts
import {HotkeysPanel} from '@gravity-ui/navigation';
```

### PropTypes

| Свойство             | Тип             | Обязательное | Значение по умолчанию | Описание                                                                                         |
| :------------------- | :-------------- | :----------: | :-------------------- | :----------------------------------------------------------------------------------------------- |
| hotkeys              | `Array`         |      Да      |                       | Список групп горячих клавиш.                                                                     |
| title                | `Array`         |              |                       | Заголовок панели.                                                                                |
| visible              | `Boolean`       |      Да      |                       | Определяет видимость выдвижной панели.                                                           |
| onClose              | `Function`      |              |                       | Обработчик закрытия выдвижной панели.                                                            |
| filterable           | `Boolean`       |              | true                  | Определяет видимость поля поиска.                                                                |
| filterPlaceholder    | `String`        |              |                       | Заглушка для поля поиска.                                                                        |
| filterClassName      | `String`        |              |                       | Имя класса поля поиска.                                                                          |
| leftOffset           | `Number/String` |              | 0                     | Отступ слева для выдвижной панели.                                                               |
| topOffset            | `Number/String` |              | 0                     | Отступ сверху для выдвижной панели.                                                              |
| preventScrollBody    | `Boolean`       |              | true                  | Определяет, следует ли отключать прокрутку основного содержимого, когда выдвижная панель видима. |
| emptyState           | `ReactNode`     |              |                       | Заглушка при отсутствии результатов поиска.                                                      |
| className            | `String`        |              |                       | Имя класса выдвижной панели.                                                                     |
| drawerItemClassName  | `String`        |              |                       | Имя класса элемента выдвижной панели.                                                            |
| titleClassName       | `String`        |              |                       | Имя класса заголовка.                                                                            |
| itemContentClassName | `String`        |              |                       | Имя класса содержимого элементов списка.                                                         |
| listClassName        | `String`        |              |                       | Имя класса списка.                                                                               |

Свойства `HotkeysPanel` также включают все PropTypes компонента `List`, кроме `items` и `filter` (свойства `List` см. [здесь](https://github.com/gravity-ui/uikit/blob/main/src/components/List/README.md)).

## API CSS

| Имя                                  | Описание                       | Значение по умолчанию |
| :----------------------------------- | :----------------------------- | :-------------------: |
| `--hotkeys-panel-width`              | Ширина панели.                 |        `400px`        |
| `--hotkeys-panel-vertical-padding`   | Отступы панели сверху и снизу. |        `18px`         |
| `--hotkeys-panel-horizontal-padding` | Отступы панели слева и справа. |        `24px`         |

### Использование

См. пример использования в Storybook: `src/components/HotkeysPanel/__stories__/HotkeysPanelShowcase`.
