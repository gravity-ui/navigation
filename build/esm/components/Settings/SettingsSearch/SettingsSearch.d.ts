import React from 'react';
import { TextInputSize } from '@gravity-ui/uikit';
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
export declare function SettingsSearch({ className, initialValue, onChange, debounce, inputRef, inputSize, placeholder, autoFocus, }: SettingsSearchProps): React.JSX.Element;
export {};
