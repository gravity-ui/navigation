import React from 'react';

import {Button, DropdownMenu} from '@gravity-ui/uikit';
import {Breadcrumbs as LegacyBreadcrumbs} from '@gravity-ui/uikit/legacy';

import {ActionBar} from '../ActionBar';

export function ActionBarSingleSection() {
    return (
        <ActionBar>
            <ActionBar.Section type="primary">
                <ActionBar.Group>
                    <ActionBar.Item>
                        <LegacyBreadcrumbs
                            lastDisplayedItemsCount={1}
                            items={[
                                {text: 'Devtools Support', action() {}},
                                {text: 'DEVTOOLSSUPPORT-21001', action() {}},
                            ]}
                            firstDisplayedItemsCount={1}
                        />
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
