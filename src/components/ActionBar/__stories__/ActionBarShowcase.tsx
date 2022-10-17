import React from 'react';
import {Breadcrumbs, Button, DropdownMenu, Select} from '@gravity-ui/uikit';

import {ActionBar} from '../ActionBar';

export function ActionBarShowcase() {
    return (
        <ActionBar aria-label="Actions bar">
            <ActionBar.Section type="secondary">
                <ActionBar.Group>
                    <ActionBar.Item>
                        <Select
                            value={['main']}
                            options={[
                                {content: 'main', value: 'main'},
                                {
                                    content: 'dev',
                                    value: 'dev',
                                },
                            ]}
                        />
                    </ActionBar.Item>
                </ActionBar.Group>
            </ActionBar.Section>
            <ActionBar.Section type="primary">
                <ActionBar.Group pull="left">
                    <ActionBar.Item>
                        <Breadcrumbs
                            lastDisplayedItemsCount={1}
                            items={[
                                {text: 'Projects', action() {}},
                                {text: '@gravity-ui', action() {}},
                                {text: 'navigation', action() {}},
                            ]}
                            firstDisplayedItemsCount={1}
                        />
                    </ActionBar.Item>
                </ActionBar.Group>

                <ActionBar.Group pull="right">
                    <ActionBar.Item>
                        <Button href="#" view="flat">
                            Quick Start Guide
                        </Button>
                    </ActionBar.Item>

                    <ActionBar.Item>
                        <DropdownMenu
                            items={[
                                {text: 'New File', action() {}},
                                {text: 'New Folder', action() {}},
                            ]}
                        />
                    </ActionBar.Item>
                </ActionBar.Group>
            </ActionBar.Section>
        </ActionBar>
    );
}
