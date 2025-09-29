import React from 'react';

import {Icon} from '@gravity-ui/uikit';

import {createBlock} from '../../utils/cn';
import {useCurrent, useStableCallback} from '../helpers';
import {Item, SettingsMenuProps} from '../types';

import styles from './SettingsMenu.module.scss';

const b = createBlock('settings-menu', styles);

export interface SettingsMenuInstance {
    handleKeyDown(event: React.KeyboardEvent): boolean;
    clearFocus(): void;
}

export const SettingsMenu = React.forwardRef<SettingsMenuInstance, SettingsMenuProps>(
    // eslint-disable-next-line prefer-arrow-callback
    function SettingsMenu({items, onChange, activeItemId}, ref) {
        const [focusItemId, setFocusId] = React.useState<string>();
        const containerRef = React.useRef<HTMLDivElement>(null);
        const handleChange = useStableCallback(onChange);
        const getFocused = useCurrent(focusItemId);

        React.useImperativeHandle(
            ref,
            () => ({
                handleKeyDown(event) {
                    if (!containerRef.current) {
                        return false;
                    }
                    const focused = getFocused();
                    if (focused && event.key === 'Enter') {
                        handleChange(focused);
                        return true;
                    } else if (event.key === 'ArrowDown') {
                        setFocusId(focusNext(containerRef.current, focused, 1));
                        return true;
                    } else if (event.key === 'ArrowUp') {
                        setFocusId(focusNext(containerRef.current, focused, -1));
                        return true;
                    }
                    return false;
                },
                clearFocus() {
                    setFocusId(undefined);
                },
            }),
            [getFocused, handleChange],
        );

        return (
            <div ref={containerRef} className={b()}>
                {items.map((firstLevelItem) => {
                    if ('groupTitle' in firstLevelItem) {
                        return (
                            <div key={firstLevelItem.groupTitle} className={b('group')}>
                                <span className={b('group-heading')}>
                                    {firstLevelItem.groupTitle}
                                </span>
                                {firstLevelItem.items.map((item) => {
                                    return renderMenuItem(
                                        item,
                                        onChange,
                                        activeItemId,
                                        focusItemId,
                                    );
                                })}
                            </div>
                        );
                    }
                    return renderMenuItem(firstLevelItem, onChange, activeItemId, focusItemId);
                })}
            </div>
        );
    },
);

function renderMenuItem(
    item: Item,
    onChange: (id: string) => void,
    activeItemId: string | undefined,
    focusItemId: string | undefined,
) {
    return (
        <span
            key={item.title}
            className={b('item', {
                selected: activeItemId === item.id,
                disabled: item.disabled,
                focused: focusItemId === item.id,
                badge: item.withBadge,
            })}
            onClick={() => {
                if (!item.disabled) {
                    onChange(item.id);
                }
            }}
            data-id={item.id}
        >
            {item.icon ? <Icon size={16} {...item.icon} className={b('item-icon')} /> : undefined}
            <span>{item.title}</span>
        </span>
    );
}

function focusNext(container: HTMLElement, focused: string | undefined, direction: number) {
    const elements = container.querySelectorAll(`.${b('item')}:not(.${b('item')}_disabled)`);
    if (elements.length === 0) {
        return undefined;
    }

    let currentIndex = direction > 0 ? -1 : 0;
    if (focused) {
        currentIndex = Array.prototype.findIndex.call(
            elements,
            (element) => element.getAttribute('data-id') === focused,
        );
    }

    currentIndex = (elements.length + currentIndex + direction) % elements.length;
    return elements[currentIndex].getAttribute('data-id') ?? undefined;
}
