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
                            title={'Select an environment'}
                        />
                    </ActionBar.Item>
                </ActionBar.Group>
            </ActionBar.Section>
            <ActionBar.Section type="primary">
                <ActionBar.Group pull="left-grow">
                    <ActionBar.Item pull="left-grow">
                        <Breadcrumbs showRoot={true} onAction={(id) => alert(id)}>
                            <Breadcrumbs.Item href="/" key="1">
                                Projects
                            </Breadcrumbs.Item>
                            <Breadcrumbs.Item key="2">@gravity-ui</Breadcrumbs.Item>
                            <Breadcrumbs.Item key="3">navigation</Breadcrumbs.Item>
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
