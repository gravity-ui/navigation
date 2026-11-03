import React from 'react';

import {Breadcrumbs, Button} from '@gravity-ui/uikit';
import {DropdownMenu} from '@gravity-ui/uikit/legacy';

import {ActionBar} from '../ActionBar';

export function ActionBarSingleSection() {
    return (
        <ActionBar>
            <ActionBar.Section type="primary">
                <ActionBar.Group stretchContainer>
                    <ActionBar.Item pull="left-grow">
                        <Breadcrumbs showRoot onAction={() => {}}>
                            <Breadcrumbs.Item key="0">Devtools Support</Breadcrumbs.Item>
                            <Breadcrumbs.Item key="1">DEVTOOLSSUPPORT-21001</Breadcrumbs.Item>
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
