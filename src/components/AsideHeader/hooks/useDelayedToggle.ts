import {useEffect, useRef, useState} from 'react';

interface ToggleDelayConfig {
    enableDelay: number;
    disableDelay: number;
}

const DEFAULT_CONFIG: ToggleDelayConfig = {
    enableDelay: 500,
    disableDelay: 200,
};

function defaultComparator(value: boolean, previousValue: boolean): boolean {
    return value !== previousValue;
}

function isTogglingOn(currentValue: boolean, previousValue: boolean): boolean {
    return !previousValue && Boolean(currentValue);
}

function isTogglingOff(currentValue: boolean, previousValue: boolean): boolean {
    return Boolean(previousValue) && !currentValue;
}

export function useDelayedToggle(
    currentValue: boolean,
    config?: ToggleDelayConfig,
    maybeShouldThrottleFn?: (value: boolean, previousValue: boolean) => boolean,
): boolean {
    const shouldThrottleFn = maybeShouldThrottleFn || defaultComparator;
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const valueCacheRef = useRef(currentValue);
    const [value, setValue] = useState(currentValue);

    const delayConfig = config || DEFAULT_CONFIG;

    useEffect(() => {
        function clear() {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        }

        if (currentValue !== valueCacheRef.current) {
            clear();

            const shouldThrottle = shouldThrottleFn(currentValue, valueCacheRef.current);
            const previousValue = valueCacheRef.current;

            valueCacheRef.current = currentValue;

            if (shouldThrottle) {
                let delay: number;

                if (isTogglingOn(currentValue, previousValue)) {
                    delay = delayConfig.enableDelay;
                } else if (isTogglingOff(currentValue, previousValue)) {
                    delay = delayConfig.disableDelay;
                } else {
                    delay = delayConfig.enableDelay;
                }

                timerRef.current = setTimeout(() => {
                    setValue(currentValue);
                }, delay);
            } else {
                setValue(currentValue);
            }
        }

        return clear;
    }, [currentValue, delayConfig.enableDelay, delayConfig.disableDelay, shouldThrottleFn]);

    return value;
}
