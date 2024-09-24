'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('../../../node_modules/react/jsx-runtime.cjs');
const index = require('../../../node_modules/react/index.cjs');
const debounce = require('../../../node_modules/lodash/debounce.cjs');
const cn = require('../../utils/cn.cjs');
const helpers = require('../helpers.cjs');
const index$1 = require('../i18n/index.cjs');
const TextInput = require('../../../node_modules/@gravity-ui/uikit/build/esm/components/controls/TextInput/TextInput.cjs');

const b = cn.block("settings-search");
function SettingsSearch({
  className,
  initialValue,
  onChange,
  debounce: debounce$1 = 200,
  inputRef,
  inputSize,
  placeholder,
  autoFocus = true
}) {
  const [value, setValue] = index.default.useState(initialValue ?? "");
  const onChangeDebounced = helpers.useStableCallback(debounce.default(onChange, debounce$1));
  const handleUpdate = helpers.useStableCallback((updated) => {
    setValue(updated);
    onChangeDebounced(updated);
  });
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx("div", { className: b(null, className), children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(
    TextInput.TextInput,
    {
      value,
      controlRef: inputRef,
      hasClear: true,
      autoFocus,
      size: inputSize,
      placeholder,
      onUpdate: handleUpdate,
      controlProps: {
        "aria-label": index$1.default("label_search")
      }
    }
  ) });
}

exports.SettingsSearch = SettingsSearch;
//# sourceMappingURL=SettingsSearch.cjs.map
