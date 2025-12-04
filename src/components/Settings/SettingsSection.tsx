import React from 'react';

import {Flex} from '@gravity-ui/uikit';

import {useSettingsContext} from './SettingsContext/useSettingsContext';
import {SettingRow} from './SettingsRow/SettingsRow';
import {b} from './b';
import type {SettingsPageSection} from './collect-settings';

export const SettingsSection = React.forwardRef<
    HTMLDivElement,
    SettingsPageSection & {
        search: string;
        isMobile: boolean;
        isSelected: boolean;
    }
>(({search, isMobile, isSelected, ...section}, ref) => {
    const {renderSectionRightAdornment, showRightAdornmentOnHover} = useSettingsContext();

    return (
        <div className={b('section', {selected: isSelected})} ref={isSelected ? ref : undefined}>
            {section.title && !section.hideTitle && (
                <h3 className={b('section-heading')}>
                    {renderSectionRightAdornment ? (
                        <Flex gap={2} alignItems={'center'}>
                            {section.title}
                            <div
                                className={b('section-right-adornment', {
                                    hidden: showRightAdornmentOnHover,
                                })}
                            >
                                {renderSectionRightAdornment(section)}
                            </div>
                        </Flex>
                    ) : (
                        section.title
                    )}
                </h3>
            )}

            {section.header &&
                (isMobile ? (
                    <div className={b('section-subheader')}>{section.header}</div>
                ) : (
                    section.header
                ))}

            {section.items.map((setting) =>
                setting.hidden ? null : (
                    <SettingRow {...setting} key={setting.title} search={search} />
                ),
            )}
        </div>
    );
});

SettingsSection.displayName = 'SettingsSection';
