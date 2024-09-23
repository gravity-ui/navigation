import React__default from 'react';
import { TextInput } from '@gravity-ui/uikit';
import debounce_1 from '../../../node_modules/lodash/debounce.js';
import { block } from '../../utils/cn.js';
import { useStableCallback } from '../helpers.js';
import i18n from '../i18n/index.js';

const b = block('settings-search');
function SettingsSearch({ className, initialValue, onChange, debounce = 200, inputRef, inputSize, placeholder, autoFocus = true, }) {
    const [value, setValue] = React__default.useState(initialValue !== null && initialValue !== void 0 ? initialValue : '');
    const onChangeDebounced = useStableCallback(debounce_1(onChange, debounce));
    const handleUpdate = useStableCallback((updated) => {
        setValue(updated);
        onChangeDebounced(updated);
    });
    return (React__default.createElement("div", { className: b(null, className) },
        React__default.createElement(TextInput, { value: value, controlRef: inputRef, hasClear: true, autoFocus: autoFocus, size: inputSize, placeholder: placeholder, onUpdate: handleUpdate, controlProps: {
                'aria-label': i18n('label_search'),
            } })));
}

export { SettingsSearch };
//# sourceMappingURL=SettingsSearch.js.map
