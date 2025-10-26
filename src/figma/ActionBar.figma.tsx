import React from 'react';

import figma from '@figma/code-connect';
import {Breadcrumbs, Button} from '@gravity-ui/uikit';

import {ActionBar} from '../components/ActionBar/ActionBar';

const figmaUrl =
    'https://www.figma.com/design/LwOcKoxx9fpdYlUjqQhzzBb4/YC-Gravity-UI?node-id=50267-11815&m=dev';

figma.connect(ActionBar, figmaUrl, {
    props: {},
    example: () => (
        <ActionBar aria-label="Actions bar">
            <ActionBar.Section>
                <ActionBar.Group>
                    <ActionBar.Item>
                        <Breadcrumbs>
                            <Breadcrumbs.Item>Page</Breadcrumbs.Item>
                        </Breadcrumbs>
                    </ActionBar.Item>
                </ActionBar.Group>

                <ActionBar.Group pull="right">
                    <ActionBar.Item>
                        <Button>Do something</Button>
                    </ActionBar.Item>
                </ActionBar.Group>
            </ActionBar.Section>
        </ActionBar>
    ),
});
