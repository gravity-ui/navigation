import { j as jsxRuntimeExports } from '../../../node_modules/react/jsx-runtime.mjs';
import React__default from 'react';
import { TextInput } from '@gravity-ui/uikit';
import debounceFn from '../../../node_modules/lodash/debounce.mjs';
import { block } from '../../utils/cn.mjs';
import { useStableCallback } from '../helpers.mjs';
import i18n from '../i18n/index.mjs';

const b = block("settings-search");
function SettingsSearch({
  className,
  initialValue,
  onChange,
  debounce = 200,
  inputRef,
  inputSize,
  placeholder,
  autoFocus = true
}) {
  const [value, setValue] = React__default.useState(initialValue ?? "");
  const onChangeDebounced = useStableCallback(debounceFn(onChange, debounce));
  const handleUpdate = useStableCallback((updated) => {
    setValue(updated);
    onChangeDebounced(updated);
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: b(null, className), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    TextInput,
    {
      value,
      controlRef: inputRef,
      hasClear: true,
      autoFocus,
      size: inputSize,
      placeholder,
      onUpdate: handleUpdate,
      controlProps: {
        "aria-label": i18n("label_search")
      }
    }
  ) });
}

export { SettingsSearch };
//# sourceMappingURL=SettingsSearch.mjs.map
