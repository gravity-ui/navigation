import React from 'react';

import {Breadcrumbs, Button, DropdownMenu, Select} from '@gravity-ui/uikit';

import {ActionBar} from '../ActionBar';

export function ActionBarStretchGroupShowcase() {
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
                            title={'Select an environment'}
                        />
                    </ActionBar.Item>
                </ActionBar.Group>
            </ActionBar.Section>
            <ActionBar.Section type="primary">
                <ActionBar.Group pull="left" stretchContainer={true}>
                    <ActionBar.Item pull="left-grow">
                        <Breadcrumbs onAction={(id) => alert(id)}>
                            <Breadcrumbs.Item href="/" key="1">
                                Wiki Main Page
                            </Breadcrumbs.Item>
                            <Breadcrumbs.Item href="/" key="2">
                                Wiki Article
                            </Breadcrumbs.Item>
                        </Breadcrumbs>
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
                            defaultSwitcherProps={{
                                extraProps: {
                                    'aria-label': 'More',
                                },
                            }}
                        />
                    </ActionBar.Item>
                </ActionBar.Group>
            </ActionBar.Section>
        </ActionBar>
    );
}
