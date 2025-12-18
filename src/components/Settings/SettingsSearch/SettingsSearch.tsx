import React, {useEffect} from 'react';

import {TextInput, TextInputSize} from '@gravity-ui/uikit';
import debounceFn from 'lodash/debounce';

import {cn} from '../../utils/cn';
import {SettingsSelection} from '../Selection/types';
import {useStableCallback} from '../helpers';
import i18n from '../i18n';

const b = cn('settings-search');

interface SettingsSearchProps {
    className?: string;
    initialValue?: string;
    onChange: (search: string) => void;
    debounce?: number;
    inputRef?: React.Ref<HTMLInputElement>;
    inputSize?: TextInputSize;
    placeholder?: string;
    autoFocus?: boolean;
    selection?: SettingsSelection;
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
    selection,
}: SettingsSearchProps) {
    const [value, setValue] = React.useState(initialValue ?? '');

    const onChangeDebounced = debounceFn(onChange, debounce);

    const handleUpdate = useStableCallback((updated: string) => {
        setValue(updated);
        onChangeDebounced(updated);
    });

    useEffect(() => {
        if (value && selection) {
            onChangeDebounced.cancel();
            setValue('');
            onChange('');
        }
        // Remove any search, if selection is passed
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selection]);

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
                controlProps={{
                    'aria-label': i18n('label_search'),
                }}
            />
        </div>
    );
}
