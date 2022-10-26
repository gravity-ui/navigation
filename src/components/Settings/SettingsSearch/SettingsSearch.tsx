import React from 'react';
import debounceFn from 'lodash/debounce';

import {TextInput} from '@gravity-ui/uikit';

import {block} from '../../utils/cn';
import {useStableCallback} from '../helpers';

const b = block('settings-search');

interface SettingsSearchProps {
    className?: string;
    onChange: (search: string) => void;
    debounce?: number;
    inputRef?: React.Ref<HTMLInputElement>;
    placeholder?: string;
}

export function SettingsSearch({
    className,
    onChange,
    debounce = 200,
    inputRef,
    placeholder,
}: SettingsSearchProps) {
    const onChangeStable = useStableCallback(onChange);
    const handleUpdate = React.useCallback(debounceFn(onChangeStable, debounce), [debounce]);
    return (
        <div className={b(null, className)}>
            <TextInput
                controlRef={inputRef}
                hasClear
                autoFocus
                placeholder={placeholder}
                onUpdate={handleUpdate}
            />
        </div>
    );
}
