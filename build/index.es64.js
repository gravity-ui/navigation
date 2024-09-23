import { jsx } from 'react/jsx-runtime';
import React__default from 'react';
import { TextInput } from '@gravity-ui/uikit';
import debounceFn from './index.es96.js';
import { block } from './index.es24.js';
import { useStableCallback } from './index.es66.js';
import i18n from './index.es67.js';

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
  return /* @__PURE__ */ jsx("div", { className: b(null, className), children: /* @__PURE__ */ jsx(
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
//# sourceMappingURL=index.es64.js.map
