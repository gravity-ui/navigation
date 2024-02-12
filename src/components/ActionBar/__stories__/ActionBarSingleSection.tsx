import React from 'react';

import {Breadcrumbs, Button, ClipboardButton, DropdownMenu} from '@gravity-ui/uikit';

import {ActionBar} from '../ActionBar';

export function ActionBarSingleSection() {
    return (
        <ActionBar>
            <ActionBar.Section type="primary">
                <ActionBar.Group>
                    <ActionBar.Item>
                        <Breadcrumbs
                            lastDisplayedItemsCount={1}
                            items={[
                                {text: 'Devtools Support', action() {}},
                                {text: 'DEVTOOLSSUPPORT-21001', action() {}},
                            ]}
                            firstDisplayedItemsCount={1}
                        />
                    </ActionBar.Item>

                    <ActionBar.Item spacing={false}>
                        <ClipboardButton size={16} text={'DEVTOOLSSUPPORT-21001'} />
                    </ActionBar.Item>
                </ActionBar.Group>

                <ActionBar.Group pull="right">
                    <ActionBar.Item>
                        <Button view="flat">Some users</Button>
                    </ActionBar.Item>

                    <ActionBar.Separator />

                    <ActionBar.Item>
                        <Button view="flat">Macros</Button>
                    </ActionBar.Item>

                    <ActionBar.Item>
                        <DropdownMenu
                            switcher={<Button>Actions</Button>}
                            items={[{text: 'Convert to sub-issue', action() {}}]}
                        />
                    </ActionBar.Item>
                </ActionBar.Group>
            </ActionBar.Section>
        </ActionBar>
    );
}
