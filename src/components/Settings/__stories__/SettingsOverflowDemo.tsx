import React from 'react';

import {Gear} from '@gravity-ui/icons';
import {Switch} from '@gravity-ui/uikit';

import {Settings} from '../index';

export function SettingsOverflowDemo() {
    const groups = Array.from({length: 5}, (_g, groupIndex) => ({
        id: `group-${groupIndex}`,
        title: `Group ${groupIndex + 1}`,
        pages: Array.from({length: 6}, (_p, pageIndex) => ({
            id: `group-${groupIndex}-page-${pageIndex}`,
            title: `Page ${pageIndex + 1}`,
        })),
    }));

    const sections = Array.from({length: 8}, (_s, sectionIndex) => ({
        id: `section-${sectionIndex}`,
        title: `Section ${sectionIndex + 1}`,
        items: Array.from({length: 5}, (_i, itemIndex) => ({
            id: `section-${sectionIndex}-item-${itemIndex}`,
            title: `Setting ${itemIndex + 1}`,
        })),
    }));

    return (
        <div style={{height: 600}}>
            <Settings>
                {groups.map((group) => (
                    <Settings.Group key={group.id} id={group.id} groupTitle={group.title}>
                        {group.pages.map((page) => (
                            <Settings.Page
                                key={page.id}
                                id={page.id}
                                title={page.title}
                                icon={{data: Gear}}
                            >
                                {sections.map((section) => (
                                    <Settings.Section key={section.id} title={section.title}>
                                        {section.items.map((item) => (
                                            <Settings.Item key={item.id} title={item.title}>
                                                <Switch
                                                    controlProps={{
                                                        'aria-label': item.title,
                                                    }}
                                                />
                                            </Settings.Item>
                                        ))}
                                    </Settings.Section>
                                ))}
                            </Settings.Page>
                        ))}
                    </Settings.Group>
                ))}
            </Settings>
        </div>
    );
}
