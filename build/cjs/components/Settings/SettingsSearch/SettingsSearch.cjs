'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jsxRuntime = require('react/jsx-runtime');
const React = require('react');
const uikit = require('@gravity-ui/uikit');
const debounce = require('../../../node_modules/lodash/debounce.cjs');
const cn = require('../../utils/cn.cjs');
const helpers = require('../helpers.cjs');
const index = require('../i18n/index.cjs');

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
  const [value, setValue] = React.useState(initialValue ?? "");
  const onChangeDebounced = helpers.useStableCallback(debounce.default(onChange, debounce$1));
  const handleUpdate = helpers.useStableCallback((updated) => {
    setValue(updated);
    onChangeDebounced(updated);
  });
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: b(null, className), children: /* @__PURE__ */ jsxRuntime.jsx(
    uikit.TextInput,
    {
      value,
      controlRef: inputRef,
      hasClear: true,
      autoFocus,
      size: inputSize,
      placeholder,
      onUpdate: handleUpdate,
      controlProps: {
        "aria-label": index.default("label_search")
      }
    }
  ) });
}

exports.SettingsSearch = SettingsSearch;
//# sourceMappingURL=SettingsSearch.cjs.map