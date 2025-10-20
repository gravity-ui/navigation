import React from 'react';

import {b} from '../b';
import type {SettingsItem} from '../collect-settings';

import {prepareTitle} from './prepareTitle';

export const SettingRow = ({
    title: settingTitle,
    element,
    search,
}: SettingsItem & {search: string}): React.ReactElement => {
    return (
        <div className={b('section-item')}>
            {React.cloneElement(element, {
                ...element.props,
                highlightedTitle:
                    search && settingTitle ? prepareTitle(settingTitle, search) : settingTitle,
            })}
        </div>
    );
};

SettingRow.displayName = 'SettingRow';
