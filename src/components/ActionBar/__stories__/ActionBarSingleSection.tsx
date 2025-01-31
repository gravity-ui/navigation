import React from 'react';

import {Breadcrumbs, Button, DropdownMenu} from '@gravity-ui/uikit';

import {ActionBar} from '../ActionBar';

export function ActionBarSingleSection() {
    return (
        <ActionBar>
            <ActionBar.Section type="primary">
                <ActionBar.Group pull="left">
                    <ActionBar.Item pull="left-grow">
                        <Breadcrumbs showRoot={true} onAction={(id) => alert(id)}>
                            <Breadcrumbs.Item href="/" key="1">
                                Devtools Support
                            </Breadcrumbs.Item>
                            <Breadcrumbs.Item href="/" key="2">
                                DEVTOOLSSUPPORT-21001
                            </Breadcrumbs.Item>
                        </Breadcrumbs>
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
