import { default as React } from 'react';
export declare const useForwardRef: <T>(ref: React.MutableRefObject<T | null> | ((instance: T | null) => void) | null, initialValue?: any) => React.MutableRefObject<T>;
