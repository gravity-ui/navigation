import React from 'react';
import debounceFn from 'lodash/debounce';

import {TextInput, TextInputSize} from '@gravity-ui/uikit';

import {block} from '../../utils/cn';
import {useStableCallback} from '../helpers';

const b = block('settings-search');

interface SettingsSearchProps {
    className?: string;
    initialValue?: string;
    onChange: (search: string) => void;
    debounce?: number;
    inputRef?: React.Ref<HTMLInputElement>;
    inputSize?: TextInputSize;
    placeholder?: string;
    autoFocus?: boolean;
}

export function SettingsSearch({
    className,
    initialValue,
    onChange,
    debounce = 200,
    inputRef,
    inputSize,
    placeholder,
    autoFocus = true,
}: SettingsSearchProps) {
    const [value, setValue] = React.useState(initialValue ?? '');

    const onChangeDebounced = useStableCallback(debounceFn(onChange, debounce));
    const handleUpdate = useStableCallback((updated: string) => {
        setValue(updated);
        onChangeDebounced(updated);
    });

    return (
        <div className={b(null, className)}>
            <TextInput
                value={value}
                controlRef={inputRef}
                hasClear
                autoFocus={autoFocus}
                size={inputSize}
                placeholder={placeholder}
                onUpdate={handleUpdate}
            />
        </div>
    );
}
