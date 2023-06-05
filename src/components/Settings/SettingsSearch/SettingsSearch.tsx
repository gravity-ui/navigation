import React from 'react';
import debounceFn from 'lodash/debounce';

import {TextInput, TextInputSize} from '@gravity-ui/uikit';

import {block} from '../../utils/cn';
import {useStableCallback} from '../helpers';

const b = block('settings-search');

interface SettingsSearchProps {
    className?: string;
    onChange: (search: string) => void;
    debounce?: number;
    inputRef?: React.Ref<HTMLInputElement>;
    inputSize?: TextInputSize;
    placeholder?: string;
    autoFocus?: boolean;
}

export function SettingsSearch({
    className,
    onChange,
    debounce = 200,
    inputRef,
    inputSize,
    placeholder,
    autoFocus = true,
}: SettingsSearchProps) {
    const onChangeStable = useStableCallback(onChange);
    const handleUpdate = React.useCallback(debounceFn(onChangeStable, debounce), [debounce]);
    return (
        <div className={b(null, className)}>
            <TextInput
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
